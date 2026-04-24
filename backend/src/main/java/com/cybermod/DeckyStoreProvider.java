package com.cybermod;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

public class DeckyStoreProvider implements PluginProvider {
    private static final Logger logger = LoggerFactory.getLogger(DeckyStoreProvider.class);
    private final GitHubClient githubClient;
    private final FileSystemService fsService;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private static final String DATABASE_URL = "https://raw.githubusercontent.com/SteamDeckHomebrew/decky-plugin-database/main/plugins.json";

    public DeckyStoreProvider(GitHubClient githubClient, FileSystemService fsService) {
        this.githubClient = githubClient;
        this.fsService = fsService;
    }

    @Override
    public CompletableFuture<List<App.Plugin>> getPlugins() {
        return githubClient.downloadAsset(DATABASE_URL)
            .thenApply(bytes -> {
                List<App.Plugin> plugins = new ArrayList<>();
                try {
                    JsonNode root = objectMapper.readTree(bytes);
                    List<String> installedIds = fsService.listInstalledPlugins();

                    if (root.isArray()) {
                        for (JsonNode node : root) {
                            String id = node.has("name") ? node.get("name").asText().toLowerCase().replace(" ", "-") : "unknown";
                            plugins.add(new App.Plugin(
                                id,
                                getSafe(node, "name"),
                                getSafe(node, "author"),
                                getSafe(node, "description"),
                                getSafe(node, "version"),
                                getSafe(node, "icon_url"), // Icon field name might differ
                                installedIds.contains(id),
                                false,
                                "decky",
                                getSafe(node, "repo"),
                                getSafe(node, "download_url"),
                                new ArrayList<>(),
                                getSafe(node, "min_loader_version"),
                                true, // Assume OLED support for Decky plugins
                                true,
                                "",
                                ""
                            ));
                        }
                    }
                } catch (Exception e) {
                    logger.error("Ошибка при парсинге Decky Store: {}", e.getMessage());
                }
                return plugins;
            })
            .exceptionally(ex -> {
                logger.error("Не удалось загрузить Decky Store: {}", ex.getMessage());
                return List.of();
            });
    }

    @Override
    public CompletableFuture<Void> install(String pluginId) {
        return getPlugins().thenAccept(plugins -> {
            App.Plugin plugin = plugins.stream()
                .filter(p -> p.id().equals(pluginId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Плагин не найден в магазине Decky: " + pluginId));

            String downloadUrl = plugin.downloadUrl();
            if (downloadUrl == null || downloadUrl.isEmpty()) {
                throw new RuntimeException("Ссылка на скачивание отсутствует для " + pluginId);
            }

            logger.info("Скачивание Decky плагина из: {}", downloadUrl);
            byte[] zipData = githubClient.downloadAsset(downloadUrl).join();

            try {
                // Установка в папку Decky
                fsService.installPlugin(pluginId, zipData, "decky");
                logger.info("Decky плагин {} успешно установлен", pluginId);
                
                // В реальной системе здесь был бы перезапуск сервиса:
                // Runtime.getRuntime().exec("systemctl restart plugin_loader.service");
            } catch (Exception e) {
                logger.error("Ошибка при записи Decky плагина: {}", e.getMessage());
                throw new RuntimeException("Decky installation failed", e);
            }
        });
    }

    private String getSafe(JsonNode node, String field) {
        return node.has(field) ? node.get(field).asText() : "";
    }
}
