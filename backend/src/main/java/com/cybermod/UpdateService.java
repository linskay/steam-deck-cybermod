package com.cybermod;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.concurrent.CompletableFuture;

public class UpdateService {
    private static final Logger logger = LoggerFactory.getLogger(UpdateService.class);
    private static final String INSTALL_DIR = "/home/deck/cybermod";
    private static final String REPO_URL_FILE = INSTALL_DIR + "/.repo_url";
    private final GitHubClient githubClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public UpdateService(GitHubClient githubClient) {
        this.githubClient = githubClient;
    }

    private String getRepoSlug() {
        try {
            Path path = Paths.get(REPO_URL_FILE);
            if (Files.exists(path)) {
                String url = Files.readString(path).trim();
                // Extract owner/repo from https://github.com/owner/repo
                String[] parts = url.replace("https://github.com/", "").replace(".git", "").split("/");
                if (parts.length >= 2) return parts[0] + "/" + parts[1];
            }
        } catch (Exception e) {
            logger.warn("Cannot read repo URL: {}", e.getMessage());
        }
        // Fallback — can be overridden via env var
        String env = System.getenv("CYBERMOD_REPO");
        return env != null && !env.isEmpty() ? env : "cybermod/cybermod";
    }

    public CompletableFuture<UpdateInfo> checkForUpdate() {
        String repo = getRepoSlug();
        String[] parts = repo.split("/");
        if (parts.length < 2) return CompletableFuture.completedFuture(new UpdateInfo(false, getCurrentVersion(), "", ""));

        return githubClient.fetchLatestRelease(parts[0], parts[1]).thenApply(json -> {
            try {
                JsonNode root = objectMapper.readTree(json);
                String tagName = root.has("tag_name") ? root.get("tag_name").asText() : "";
                String htmlUrl = root.has("html_url") ? root.get("html_url").asText() : "";
                String current = getCurrentVersion();

                boolean hasUpdate = !tagName.isEmpty() && !tagName.equals(current) &&
                    compareVersions(tagName.replace("v", ""), current.replace("v", "")) > 0;

                return new UpdateInfo(hasUpdate, current, tagName, htmlUrl);
            } catch (Exception e) {
                logger.error("Failed to parse latest release: {}", e.getMessage());
                return new UpdateInfo(false, getCurrentVersion(), "", "");
            }
        }).exceptionally(ex -> {
            logger.warn("Update check failed: {}", ex.getMessage());
            return new UpdateInfo(false, getCurrentVersion(), "", "");
        });
    }

    public CompletableFuture<Boolean> performUpdate() {
        String repo = getRepoSlug();
        String[] parts = repo.split("/");
        if (parts.length < 2) return CompletableFuture.completedFuture(false);

        return githubClient.fetchLatestRelease(parts[0], parts[1]).thenCompose(json -> {
            try {
                JsonNode root = objectMapper.readTree(json);
                JsonNode assets = root.get("assets");
                if (assets == null || !assets.isArray() || assets.isEmpty()) {
                    logger.error("No assets found in latest release");
                    return CompletableFuture.completedFuture(false);
                }

                // Find the steamdeck tar.gz asset
                String downloadUrl = "";
                for (JsonNode asset : assets) {
                    String name = asset.get("name").asText();
                    if (name.contains("steamdeck") && name.endsWith(".tar.gz")) {
                        downloadUrl = asset.get("browser_download_url").asText();
                        break;
                    }
                }

                if (downloadUrl.isEmpty()) {
                    // Fallback to first asset
                    downloadUrl = assets.get(0).get("browser_download_url").asText();
                }

                logger.info("Downloading update from: {}", downloadUrl);
                String finalUrl = downloadUrl;
                return githubClient.downloadAsset(finalUrl).thenApply(bytes -> {
                    try {
                        applyUpdate(bytes);
                        return true;
                    } catch (Exception e) {
                        logger.error("Failed to apply update: {}", e.getMessage());
                        return false;
                    }
                });
            } catch (Exception e) {
                logger.error("Failed to parse release for update: {}", e.getMessage());
                return CompletableFuture.completedFuture(false);
            }
        });
    }

    private void applyUpdate(byte[] tarGzData) throws Exception {
        Path tmpDir = Files.createTempDirectory("cybermod-update");
        Path archive = tmpDir.resolve("update.tar.gz");
        Files.write(archive, tarGzData);

        ProcessBuilder pb = new ProcessBuilder("tar", "xzf", archive.toString(), "-C", tmpDir.toString());
        pb.redirectErrorStream(true);
        Process p = pb.start();
        try (BufferedReader r = new BufferedReader(new InputStreamReader(p.getInputStream()))) {
            String line;
            while ((line = r.readLine()) != null) logger.info("[UPDATE] {}", line);
        }
        int exit = p.waitFor();
        if (exit != 0) throw new RuntimeException("tar extraction failed with code " + exit);

        // Run install.sh from extracted contents
        ProcessBuilder install = new ProcessBuilder("bash", tmpDir.resolve("install.sh").toString());
        install.environment().put("GITHUB_REPO_URL", "https://github.com/" + getRepoSlug());
        install.redirectErrorStream(true);
        Process ip = install.start();
        try (BufferedReader r = new BufferedReader(new InputStreamReader(ip.getInputStream()))) {
            String line;
            while ((line = r.readLine()) != null) logger.info("[UPDATE-INSTALL] {}", line);
        }
        int iExit = ip.waitFor();
        if (iExit != 0) throw new RuntimeException("install.sh failed with code " + iExit);

        // Restart service
        Runtime.getRuntime().exec("systemctl --user restart cybermod.service");
        logger.info("Update applied successfully, service restarting");
    }

    private String getCurrentVersion() {
        // Read from MANIFEST or env or default
        String v = System.getenv("CYBERMOD_VERSION");
        if (v != null && !v.isEmpty()) return v;

        // Read from install dir
        try {
            Path vFile = Paths.get(INSTALL_DIR, ".version");
            if (Files.exists(vFile)) return Files.readString(vFile).trim();
        } catch (Exception ignored) {}

        // Read from config dir
        try {
            Path cfg = Paths.get(System.getProperty("user.home"), ".config", "cybermod", "version");
            if (Files.exists(cfg)) return Files.readString(cfg).trim();
        } catch (Exception ignored) {}

        return "1.2.0";
    }

    private int compareVersions(String v1, String v2) {
        String[] a = v1.split("\\.");
        String[] b = v2.split("\\.");
        int max = Math.max(a.length, b.length);
        for (int i = 0; i < max; i++) {
            int na = i < a.length ? Integer.parseInt(a[i].replaceAll("[^0-9]", "0")) : 0;
            int nb = i < b.length ? Integer.parseInt(b[i].replaceAll("[^0-9]", "0")) : 0;
            if (na != nb) return Integer.compare(na, nb);
        }
        return 0;
    }

    public record UpdateInfo(
        boolean hasUpdate,
        String currentVersion,
        String latestVersion,
        String releaseUrl
    ) {}
}
