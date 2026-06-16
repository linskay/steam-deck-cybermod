package com.cybermod;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record PluginManifest(
    String id,
    String kind,
    String title,
    String version,
    String description,
    String icon,
    FrontendConfig frontend,
    BackendConfig backend,
    List<String> permissions
) {
    public record FrontendConfig(
        String type,
        String entry
    ) {}

    public record BackendConfig(
        String type,
        String entry,
        int port,
        String proxyPath
    ) {}
}
