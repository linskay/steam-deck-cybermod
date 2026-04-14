package com.cybermod;

import io.javalin.Javalin;
import io.javalin.http.staticfiles.Location;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.concurrent.Executors;

public class App {
    private static final Logger logger = LoggerFactory.getLogger(App.class);
    private static final FileSystemService fsService = new FileSystemService();
    private static final GitHubClient githubClient = new GitHubClient();
    private static final ManifestService manifestService = new ManifestService("../catalog/manifest.json");
    private static final PluginProvider cyberProvider = new CyberCatalogProvider(manifestService, githubClient, fsService);

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

        app.get("/api/plugins", ctx -> {
            ctx.future(() -> cyberProvider.getPlugins().thenAccept(ctx::json));
        });

        app.post("/api/install/{id}", ctx -> {
            String id = ctx.pathParam("id");
            ctx.future(() -> cyberProvider.install(id).thenAccept(v -> 
                ctx.status(202).json(java.util.Map.of("status", "INSTALLING", "id", id))
            ));
        });

        app.get("/api/status", ctx -> {
            ctx.result("SYSTEM_READY");
        });
    }

    private static List<Plugin> getMockPlugins() {
        return List.of(
            new Plugin("vibrant-deck", "VibrantDeck", "Artia", "Улучшает цветопередачу экрана Steam Deck", "1.2.0", "", true, false),
            new Plugin("steam-grid-db", "SGDB", "SGDB Team", "Автоматическая загрузка обложек для игр", "2.1.5", "", false, false),
            new Plugin("decky-recorder", "Recorder", "Decky", "Запись геймплея одной кнопкой", "0.9.1", "", true, true)
        );
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
        boolean hasUpdate
    ) {}
}
