package com.cybermod;

import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

public class FileSystemService {
    private static final Logger logger = LoggerFactory.getLogger(FileSystemService.class);
    
    // Пути для Steam Deck (SteamOS)
    private static final String DECKY_PLUGINS_PATH = "/home/deck/homebrew/plugins";
    private static final String CYBER_PLUGINS_PATH = "/home/deck/cybermod/plugins";

    public FileSystemService() {
        createDirectories();
    }

    private void createDirectories() {
        try {
            Files.createDirectories(Paths.get(CYBER_PLUGINS_PATH));
        } catch (IOException e) {
            logger.warn("Не удалось создать директорию плагинов: {}", e.getMessage());
        }
    }

    public List<String> listInstalledPlugins() {
        List<String> plugins = new ArrayList<>();
        File folder = new File(DECKY_PLUGINS_PATH);
        
        if (folder.exists() && folder.isDirectory()) {
            File[] subdirs = folder.listFiles(File::isDirectory);
            if (subdirs != null) {
                for (File dir : subdirs) {
                    plugins.add(dir.getName());
                }
            }
        }
        return plugins;
    }

    public void installPlugin(String pluginName, byte[] zipData, String source) throws IOException {
        String basePath = "decky".equals(source) ? DECKY_PLUGINS_PATH : CYBER_PLUGINS_PATH;
        Path targetDir = Paths.get(basePath, pluginName);
        
        // Очистка старой версии если есть
        if (Files.exists(targetDir)) {
            FileUtils.deleteDirectory(targetDir.toFile());
        }
        
        Files.createDirectories(targetDir);

        try (ZipInputStream zis = new ZipInputStream(new java.io.ByteArrayInputStream(zipData))) {
            ZipEntry entry;
            while ((entry = zis.getNextEntry()) != null) {
                // Security: Zip-Slip protection
                Path filePath = targetDir.resolve(entry.getName()).normalize();
                if (!filePath.startsWith(targetDir)) {
                    throw new IOException("Zip Slip detected: " + entry.getName());
                }

                if (entry.isDirectory()) {
                    Files.createDirectories(filePath);
                } else {
                    Files.createDirectories(filePath.getParent());
                    Files.copy(zis, filePath);
                }
                zis.closeEntry();
            }
        }
        logger.info("Плагин {} успешно установлен в {}", pluginName, targetDir);
    }
}
