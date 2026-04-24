package com.cybermod;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.concurrent.CompletableFuture;

public class DeckyService {
    private static final Logger logger = LoggerFactory.getLogger(DeckyService.class);
    private static final String DECKY_LOADER_PATH = System.getProperty("user.home") + "/homebrew/services/PluginLoader";
    private static final String INSTALLER_URL = "https://github.com/SteamDeckHomebrew/decky-installer/releases/latest/download/install_prerelease.sh";

    public String getStatus() {
        // Проверка наличия исполняемого файла или сервиса
        Path path = Paths.get(DECKY_LOADER_PATH);
        if (Files.exists(path)) {
            return "INSTALLED";
        }
        
        // Дополнительная проверка через systemctl (если на Steam Deck)
        try {
            Process process = Runtime.getRuntime().exec("systemctl is-active plugin_loader.service");
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line = reader.readLine();
            if ("active".equals(line)) {
                return "INSTALLED";
            }
        } catch (Exception e) {
            // Игнорируем, если не в Linux/SteamOS
        }

        return "NOT_INSTALLED";
    }

    public CompletableFuture<Boolean> installLoader() {
        return CompletableFuture.supplyAsync(() -> {
            try {
                logger.info("Начало установки Decky Loader...");
                // В реальной среде здесь был бы вызов скрипта:
                // curl -L https://github.com/SteamDeckHomebrew/decky-installer/releases/latest/download/install_release.sh | sh
                
                // Для демо/дева просто имитируем задержку
                Thread.sleep(3000);
                
                logger.info("Decky Loader успешно установлен (имитация)");
                return true;
            } catch (Exception e) {
                logger.error("Ошибка при установке Decky Loader: {}", e.getMessage());
                return false;
            }
        });
    }
}
