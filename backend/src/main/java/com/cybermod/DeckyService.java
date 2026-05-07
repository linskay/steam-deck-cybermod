package com.cybermod;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CopyOnWriteArrayList;

public class DeckyService {
    private static final Logger logger = LoggerFactory.getLogger(DeckyService.class);
    private static final String DECKY_LOADER_PATH = System.getProperty("user.home") + "/homebrew/services/PluginLoader";
    private final List<String> installLogs = new CopyOnWriteArrayList<>();

    public List<String> getInstallLogs() {
        return installLogs;
    }

    public boolean isSteamOS() {
        Path osRelease = Paths.get("/etc/os-release");
        try {
            return Files.exists(osRelease) && Files.readString(osRelease).contains("steamos");
        } catch (Exception e) { return false; }
    }

    public String getStatus() {
        // 1. Простая проверка по наличию папки/файла
        Path path = Paths.get(DECKY_LOADER_PATH);
        if (Files.exists(path)) {
            return "INSTALLED";
        }
        
        // 2. Проверка через systemctl
        try {
            Process process = Runtime.getRuntime().exec("systemctl is-active plugin_loader.service");
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line = reader.readLine();
                if ("active".equals(line)) return "INSTALLED";
            }
        } catch (Exception e) {}
        
        return "NOT_INSTALLED";
    }

    public CompletableFuture<Boolean> installLoader() {
        return CompletableFuture.supplyAsync(() -> {
            installLogs.clear();
            installLogs.add("--- Инициализация установки Decky Loader ---");
            
            if (!isSteamOS()) {
                installLogs.add("[WARNING] Среда не является SteamOS. Попытка установки может быть небезопасной.");
            }

            try {
                // Используем стабильный URL
                String scriptUrl = "https://github.com/SteamDeckHomebrew/decky-loader/raw/main/dist/install.sh";
                installLogs.add("Скачивание скрипта: " + scriptUrl);
                
                ProcessBuilder pb = new ProcessBuilder("sh", "-c", "curl -L " + scriptUrl + " | sh");
                pb.redirectErrorStream(true);
                Process process = pb.start();
                
                try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        installLogs.add(line);
                        logger.info("[INSTALL] " + line);
                    }
                }
                
                int exitCode = process.waitFor();
                boolean success = (exitCode == 0);
                installLogs.add(success ? "--- УСТАНОВКА ЗАВЕРШЕНА УСПЕШНО ---" : "--- ОШИБКА УСТАНОВКИ (Код: " + exitCode + ") ---");
                return success;
            } catch (Exception e) {
                installLogs.add("[CRITICAL ERROR] " + e.getMessage());
                return false;
            }
        });
    }
}
