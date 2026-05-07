package com.cybermod;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.net.ServerSocket;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.*;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class PluginRuntimeService {
    private static final Logger logger = LoggerFactory.getLogger(PluginRuntimeService.class);
    private static final String PLUGINS_PATH = "/home/deck/cybermod/plugins";
    private static final ObjectMapper mapper = new ObjectMapper();

    private final Map<String, PluginInstance> activePlugins = new ConcurrentHashMap<>();

    public PluginRuntimeService() {
        scanAndStart();
        Runtime.getRuntime().addShutdownHook(new Thread(this::stopAll));
    }

    public synchronized void scanAndStart() {
        File pluginsDir = new File(PLUGINS_PATH);
        if (!pluginsDir.exists() || !pluginsDir.isDirectory()) {
            return;
        }

        File[] dirs = pluginsDir.listFiles(File::isDirectory);
        if (dirs == null) return;

        for (File dir : dirs) {
            File manifestFile = new File(dir, "cybermod.plugin.json");
            if (manifestFile.exists()) {
                try {
                    PluginManifest manifest = mapper.readValue(manifestFile, PluginManifest.class);
                    if ("app".equals(manifest.kind())) {
                        startPlugin(manifest, dir.getAbsolutePath());
                    }
                } catch (IOException e) {
                    logger.error("Failed to read manifest in {}: {}", dir.getName(), e.getMessage());
                }
            }
        }
    }

    private void startPlugin(PluginManifest manifest, String pluginPath) {
        if (activePlugins.containsKey(manifest.id())) {
            return;
        }

        PluginInstance instance = new PluginInstance(manifest, pluginPath);
        activePlugins.put(manifest.id(), instance);

        if (manifest.backend() != null && "java-jar".equals(manifest.backend().type())) {
            instance.startBackend();
        } else {
            instance.setStatus("running");
        }
    }

    public void stopAll() {
        activePlugins.values().forEach(PluginInstance::stopBackend);
        activePlugins.clear();
    }

    public Collection<PluginInstance> getActivePluginInstances() {
        return activePlugins.values();
    }

    public List<Map<String, Object>> getExtensions() {
        List<Map<String, Object>> extensions = new ArrayList<>();
        for (PluginInstance instance : activePlugins.values()) {
            PluginManifest m = instance.manifest;
            Map<String, Object> ext = new HashMap<>();
            ext.put("id", m.id());
            ext.put("title", m.title());
            ext.put("description", m.description());
            ext.put("icon", "/plugins/" + m.id() + "/" + m.icon());
            if (m.frontend() != null) {
                ext.put("frontendUrl", "/plugins/" + m.id() + "/" + m.frontend().entry());
            }
            if (m.backend() != null) {
                ext.put("backendPort", m.backend().port());
                ext.put("proxyPath", m.backend().proxyPath());
            }
            ext.put("status", instance.status);
            extensions.add(ext);
        }
        return extensions;
    }

    public static class PluginInstance {
        final PluginManifest manifest;
        final String path;
        String status = "not_started";
        Process process;

        PluginInstance(PluginManifest manifest, String path) {
            this.manifest = manifest;
            this.path = path;
        }

        void setStatus(String status) {
            this.status = status;
        }

        void startBackend() {
            if (manifest.backend() == null) return;

            this.status = "starting";
            String jarPath = path + "/" + manifest.backend().entry();
            int port = manifest.backend().port();

            if (!isPortAvailable(port)) {
                logger.error("Port {} is already in use for plugin {}", port, manifest.id());
                this.status = "failed";
                return;
            }

            try {
                ProcessBuilder pb = new ProcessBuilder("java", "-jar", jarPath, "--port=" + port);
                pb.inheritIO();
                this.process = pb.start();

                // Robust Health Check: wait for port to be active
                boolean success = false;
                HttpClient client = HttpClient.newHttpClient();
                for (int i = 0; i < 20; i++) { // 10 seconds total
                    Thread.sleep(500);
                    if (!process.isAlive()) break;

                    try {
                        HttpRequest request = HttpRequest.newBuilder()
                                .uri(URI.create("http://localhost:" + port + "/api/status"))
                                .timeout(java.time.Duration.ofMillis(500))
                                .build();
                        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
                        if (response.statusCode() == 200 || response.statusCode() == 404) { // 404 means server is up but endpoint doesn't exist
                            success = true;
                            break;
                        }
                    } catch (Exception ignored) {}
                }

                if (success && process.isAlive()) {
                    this.status = "running";
                    logger.info("Started backend for plugin {} on port {}", manifest.id(), port);
                } else {
                    this.status = "failed";
                    logger.error("Backend for plugin {} failed health check or exited", manifest.id());
                    stopBackend();
                }
            } catch (IOException | InterruptedException e) {
                logger.error("Failed to start backend for {}: {}", manifest.id(), e.getMessage());
                this.status = "failed";
            }
        }

        void stopBackend() {
            if (process != null && process.isAlive()) {
                process.destroy();
                try {
                if (!process.waitFor(5, java.util.concurrent.TimeUnit.SECONDS)) {
                        process.destroyForcibly();
                    }
                } catch (InterruptedException e) {
                    process.destroyForcibly();
                }
                this.status = "stopped";
                logger.info("Stopped backend for plugin {}", manifest.id());
            }
        }

        private boolean isPortAvailable(int port) {
            try (ServerSocket ignored = new ServerSocket(port)) {
                return true;
            } catch (IOException e) {
                return false;
            }
        }
    }
}
