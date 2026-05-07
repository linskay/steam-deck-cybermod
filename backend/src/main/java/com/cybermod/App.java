package com.cybermod;

import io.javalin.Javalin;
import io.javalin.http.staticfiles.Location;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.concurrent.CompletableFuture;

public class App {
    private static final Logger logger = LoggerFactory.getLogger(App.class);
    private static final FileSystemService fsService = new FileSystemService();
    private static final GitHubClient githubClient = new GitHubClient();
    private static final ManifestService manifestService = new ManifestService("../catalog/manifest.json");
    private static final DeckyService deckyService = new DeckyService();
    public static final PluginRuntimeService pluginRuntimeService = new PluginRuntimeService();
    private static final PluginProvider cyberProvider = new CyberCatalogProvider(manifestService, githubClient, fsService);
    private static final PluginProvider deckyProvider = new DeckyStoreProvider(githubClient, fsService);

    public static void main(String[] args) {
        var app = Javalin.create(config -> {
            config.staticFiles.add(staticFiles -> {
                staticFiles.hostedPath = "/";
                staticFiles.directory = "/public";
                staticFiles.location = Location.CLASSPATH;
            });
            config.bundledPlugins.enableCors(cors -> cors.addRule(it -> it.anyHost()));
        }).start(7070);

        logger.info("CyberMod Backend запущен на 7070");

        // --- Plugin API ---
        app.get("/api/plugins/builtin", ctx -> {
            ctx.future(() -> cyberProvider.getPlugins().thenAccept(ctx::json));
        });

        app.get("/api/extensions", ctx -> {
            ctx.json(pluginRuntimeService.getExtensions());
        });

        app.get("/plugins/{pluginId}/<path>", ctx -> {
            String pluginId = ctx.pathParam("pluginId");
            String path = ctx.pathParam("path");

            // Security: Path Traversal protection
            Path pluginsRoot = Paths.get("/home/deck/cybermod/plugins").toAbsolutePath().normalize();
            Path targetFile = pluginsRoot.resolve(pluginId).resolve(path).normalize();

            if (!targetFile.startsWith(pluginsRoot)) {
                ctx.status(403).result("Forbidden: Path traversal detected");
                return;
            }

            File file = targetFile.toFile();
            if (file.exists() && !file.isDirectory()) {
                String contentType = ctx.queryParam("type");
                if (contentType == null) {
                    if (path.endsWith(".html")) contentType = "text/html";
                    else if (path.endsWith(".js")) contentType = "application/javascript";
                    else if (path.endsWith(".css")) contentType = "text/css";
                    else if (path.endsWith(".png")) contentType = "image/png";
                    else if (path.endsWith(".svg")) contentType = "image/svg+xml";
                    else if (path.endsWith(".json")) contentType = "application/json";
                }

                if (contentType != null) ctx.contentType(contentType);
                ctx.result(new java.io.FileInputStream(file));
            } else {
                ctx.status(404);
            }
        });

        app.get("/api/plugins/decky", ctx -> {
            ctx.future(() -> deckyProvider.getPlugins().thenAccept(ctx::json));
        });

        app.get("/api/plugins/zip", ctx -> {
            // Placeholder for ZIP plugins analysis
            ctx.json(List.of());
        });

        app.post("/api/plugins/{source}/{id}/install", ctx -> {
            String source = ctx.pathParam("source");
            String id = ctx.pathParam("id");
            PluginProvider provider = "decky".equals(source) ? deckyProvider : cyberProvider;
            
            ctx.future(() -> provider.install(id).thenAccept(v -> 
                ctx.status(202).json(java.util.Map.of("status", "INSTALLING", "id", id, "source", source))
            ));
        });

        // --- Decky Loader API ---
        app.get("/api/decky/status", ctx -> {
            ctx.json(java.util.Map.of("status", deckyService.getStatus()));
        });

        app.post("/api/decky/install-loader", ctx -> {
            ctx.future(() -> deckyService.installLoader().thenAccept(success -> 
                ctx.json(java.util.Map.of("success", success))
            ));
        });

        app.post("/api/plugins/zip/upload", ctx -> {
            var files = ctx.uploadedFiles("file");
            if (files.isEmpty()) {
                ctx.status(400).result("No file uploaded");
                return;
            }
            var file = files.getFirst();
            byte[] content = file.content().readAllBytes();
            String name = file.filename().replace(".zip", "");
            
            ctx.future(() -> CompletableFuture.runAsync(() -> {
                try {
                    fsService.installPlugin(name, content, "zip");
                } catch (java.io.IOException e) {
                    throw new RuntimeException(e);
                }
            }).thenAccept(v -> ctx.json(java.util.Map.of("status", "SUCCESS", "id", name))));
        });

        // --- System API ---
        app.get("/api/system/stats", ctx -> {
            var runtime = Runtime.getRuntime();
            long maxMemory = runtime.maxMemory();
            long allocatedMemory = runtime.totalMemory();
            long freeMemory = runtime.freeMemory();
            long usedMemory = allocatedMemory - freeMemory;
            
            ctx.json(java.util.Map.of(
                "status", deckyService.getStatus(),
                "memoryUsed", usedMemory / 1024 / 1024 + " MB",
                "memoryTotal", maxMemory / 1024 / 1024 + " MB",
                "cpuLoad", "2.4%", // Placeholder for real CPU load if OSHI is not available
                "latency", "1ms"
            ));
        });

        app.get("/api/system/config", ctx -> {
            ctx.json(ConfigService.load());
        });

        app.post("/api/system/config", ctx -> {
            var newConfig = ctx.bodyAsClass(ConfigService.AppConfig.class);
            ConfigService.save(newConfig);
            ctx.status(204);
        });

        app.get("/api/decky/logs", ctx -> {
            ctx.json(java.util.Map.of("logs", deckyService.getInstallLogs()));
        });

        app.get("/api/status", ctx -> {
            ctx.result("SYSTEM_READY");
        });
    }

    public static class ConfigService {
        private static final String CONFIG_DIR = System.getProperty("user.home") + "/.config/cybermod";
        private static final String CONFIG_PATH = CONFIG_DIR + "/config.json";
        private static final com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();

        public record AppConfig(String activeTheme) {}

        private static void ensureDir() {
            new File(CONFIG_DIR).mkdirs();
        }

        public static AppConfig load() {
            try {
                File file = new File(CONFIG_PATH);
                if (file.exists()) return mapper.readValue(file, AppConfig.class);
            } catch (Exception e) { logger.error("Config load error", e); }
            return new AppConfig("cyberpunk");
        }

        public static void save(AppConfig config) {
            try {
                ensureDir();
                mapper.writeValue(new File(CONFIG_PATH), config);
            } catch (Exception e) { logger.error("Config save error", e); }
        }
    }



    // Modern Java 21 Record for Plugin Model
    public record Plugin(
        String id,
        String name,
        String author,
        String description,
        String version,
        String image,
        boolean installed,
        boolean hasUpdate,
        String source,
        String github,
        String downloadUrl,
        List<String> tags,
        String minDeckyVersion,
        boolean oledSupport,
        boolean lcdSupport,
        String targetPath,
        String checksum
    ) {}
}
