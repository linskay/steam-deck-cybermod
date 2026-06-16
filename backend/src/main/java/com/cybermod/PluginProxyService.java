package com.cybermod;

import io.javalin.Javalin;
import io.javalin.http.Context;
import io.javalin.http.HandlerType;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class PluginProxyService {

    private static final HttpClient httpClient = HttpClient.newBuilder()
            .version(HttpClient.Version.HTTP_1_1)
            .build();

    public static void register(Javalin app, PluginRuntimeService runtimeService) {
        app.addHttpHandler(HandlerType.BEFORE, "/api/*", ctx -> {
            String path = ctx.path();
            for (var instance : runtimeService.getActivePluginInstances()) {
                var m = instance.manifest;
                if (m.backend() != null && m.backend().proxyPath() != null && path.startsWith(m.backend().proxyPath())) {
                    proxyRequest(ctx, instance);
                    return;
                }
            }
        });
    }

    private static void proxyRequest(Context ctx, PluginRuntimeService.PluginInstance instance) {
        if (!"running".equals(instance.status)) {
            ctx.status(503).result("Plugin backend is not running");
            return;
        }
        var m = instance.manifest;
        String subPath = ctx.path().substring(m.backend().proxyPath().length());
        String targetUrl = "http://localhost:" + m.backend().port() + subPath;
        if (ctx.queryString() != null) targetUrl += "?" + ctx.queryString();

        try {
            var request = HttpRequest.newBuilder()
                    .uri(URI.create(targetUrl))
                    .method(ctx.method().name(), HttpRequest.BodyPublishers.ofByteArray(ctx.bodyAsBytes()))
                    .build();
            var response = httpClient.send(request, HttpResponse.BodyHandlers.ofByteArray());

            ctx.status(response.statusCode());
            response.headers().map().forEach((k, v) -> v.forEach(val -> ctx.header(k, val)));
            ctx.result(response.body());
            ctx.skipRemainingHandlers();
        } catch (Exception e) {
            ctx.status(502).result("Proxy error: " + e.getMessage());
        }
    }
}
