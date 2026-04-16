package com.billflow.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // /** -> Puede entrar a todas las URL (/gastos, /categorias, /usuario...)
        registry.addMapping("/**")
                // Pueden pasar todos (por ahora hasta que MANUEL me diga que url usar)
                .allowedOrigins("*")
                // Permite usar los métodos
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                // Permite recibir cualquier header ("Content-Type", "Authorization", "Accept")
                .allowedHeaders("*");
    }
}