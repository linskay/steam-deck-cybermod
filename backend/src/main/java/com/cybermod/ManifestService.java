package com.cybermod;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class ManifestService {
    private static final Logger logger = LoggerFactory.getLogger(ManifestService.class);
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String manifestPath;

    public ManifestService(String manifestPath) {
        this.manifestPath = manifestPath;
    }

    public List<App.Plugin> loadPlugins() {
        List<App.Plugin> plugins = new ArrayList<>();
        File manifestFile = new File(manifestPath);

        if (!manifestFile.exists()) {
            logger.warn("Манифест не найден: {}", manifestPath);
            return plugins;
        }

        try {
            JsonNode root = objectMapper.readTree(manifestFile);
            JsonNode pluginsArray = root.get("plugins");

            if (pluginsArray != null && pluginsArray.isArray()) {
                for (JsonNode node : pluginsArray) {
                    plugins.add(new App.Plugin(
                            node.get("id").asText(),
                            node.get("name").asText(),
                            node.get("author").asText(),
                            node.get("description").asText(),
                            node.get("version").asText(),
                            node.get("image").asText(),
                            false, // Статус установки будет проверен в App.java
                            false
                    ));
                }
            }
        } catch (IOException e) {
            logger.error("Ошибка при чтении манифеста: {}", e.getMessage());
        }

        return plugins;
    }
}
