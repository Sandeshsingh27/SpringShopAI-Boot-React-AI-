package com.ecom.SpringEcom.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("SpringShop AI API")
                        .version("1.0")
                        .description("Full-stack e-commerce REST API with RAG-powered AI chatbot, "
                                + "AI product generation, and order management.")
                        .contact(new Contact()
                                .name("Sandesh Singh")
                                .url("https://github.com/Sandeshsingh27/SpringShopAI-Boot-React-AI-")));
    }
}

