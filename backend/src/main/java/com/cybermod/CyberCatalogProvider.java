package com.cybermod;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.concurrent.CompletableFuture;

public class CyberCatalogProvider implements PluginProvider {
    private static final Logger logger = LoggerFactory.getLogger(CyberCatalogProvider.class);
    private final ManifestService manifestService;
    private final GitHubClient githubClient;
    private final FileSystemService fsService;

    public CyberCatalogProvider(ManifestService manifestService, GitHubClient githubClient, FileSystemService fsService) {
        this.manifestService = manifestService;
        this.githubClient = githubClient;
        this.fsService = fsService;
    }

    @Override
    public CompletableFuture<List<App.Plugin>> getPlugins() {
        return CompletableFuture.supplyAsync(() -> {
            List<App.Plugin> plugins = manifestService.loadPlugins();
            List<String> installedIds = fsService.listInstalledPlugins();
            
            return plugins.stream().map(p -> new App.Plugin(
                p.id(), p.name(), p.author(), p.description(), p.version(),
                p.image(), installedIds.contains(p.id()), p.hasUpdate(),
                p.source(), p.github(), p.downloadUrl(), p.tags(),
                p.minDeckyVersion(), p.oledSupport(), p.lcdSupport(),
                p.targetPath(), p.checksum()
            )).toList();
        });
    }

    @Override
    public CompletableFuture<Void> install(String pluginId) {
        return CompletableFuture.runAsync(() -> {
            logger.info("Начало установки плагина: {}", pluginId);
            
            try {
                // 1. Найти плагин в манифесте
                List<App.Plugin> plugins = manifestService.loadPlugins();
                App.Plugin plugin = plugins.stream()
                    .filter(p -> p.id().equals(pluginId))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Плагин не найден в манифесте: " + pluginId));

                // 2. Получить URL для скачивания
                String downloadUrl = plugin.downloadUrl();
                if (downloadUrl == null || downloadUrl.isEmpty()) {
                    if (plugin.github() != null && !plugin.github().isEmpty()) {
                        String[] parts = plugin.github().split("/");
                        if (parts.length == 2) {
                            String releaseJson = githubClient.fetchLatestRelease(parts[0], parts[1]).join();
                            // Парсим JSON релиза для поиска asset
                            com.fasterxml.jackson.databind.JsonNode root = new com.fasterxml.jackson.databind.ObjectMapper().readTree(releaseJson);
                            com.fasterxml.jackson.databind.JsonNode assets = root.get("assets");
                            if (assets != null && assets.isArray() && assets.size() > 0) {
                                // Берем первый подходящий zip/tar.gz
                                for (com.fasterxml.jackson.databind.JsonNode asset : assets) {
                                    String name = asset.get("name").asText();
                                    if (name.endsWith(".zip")) {
                                        downloadUrl = asset.get("browser_download_url").asText();
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }

                if (downloadUrl == null || downloadUrl.isEmpty()) {
                    throw new RuntimeException("Не удалось найти ссылку на скачивание для " + pluginId);
                }

                // 3. Скачать
                logger.info("Скачивание из: {}", downloadUrl);
                byte[] zipData = githubClient.downloadAsset(downloadUrl).join();

                // 4. Установить
                fsService.installPlugin(pluginId, zipData);
                logger.info("Плагин {} успешно установлен", pluginId);

            } catch (Exception e) {
                logger.error("Ошибка при установке плагина {}: {}", pluginId, e.getMessage());
                throw new RuntimeException("Installation failed", e);
            }
        });
    }
}
