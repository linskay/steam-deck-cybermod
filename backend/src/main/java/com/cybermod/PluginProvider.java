package com.cybermod;

import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface PluginProvider {
    CompletableFuture<List<App.Plugin>> getPlugins();
    CompletableFuture<Void> install(String pluginId);
}
