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
    private static final DeckyService deckyService = new DeckyService();
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

        app.get("/api/status", ctx -> {
            ctx.result("SYSTEM_READY");
        });
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
