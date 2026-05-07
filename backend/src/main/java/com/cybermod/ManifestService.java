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
                            getSafe(node, "name"),
                            getSafe(node, "author"),
                            getSafe(node, "description"),
                            getSafe(node, "version"),
                            getSafe(node, "image"),
                            false,
                            false,
                            "builtin", // Default source
                            getSafe(node, "github"),
                            getSafe(node, "downloadUrl"),
                            new ArrayList<>(), // tags
                            getSafe(node, "minDeckyVersion"),
                            node.has("oledSupport") && node.get("oledSupport").asBoolean(),
                            node.has("lcdSupport") && node.get("lcdSupport").asBoolean(),
                            getSafe(node, "targetPath"),
                            getSafe(node, "checksum")
                    ));
                }
            }
        } catch (IOException e) {
            logger.error("Ошибка при чтении манифеста: {}", e.getMessage());
        }

        return plugins;
    }

    private String getSafe(JsonNode node, String field) {
        return node.has(field) ? node.get(field).asText() : "";
    }
}
