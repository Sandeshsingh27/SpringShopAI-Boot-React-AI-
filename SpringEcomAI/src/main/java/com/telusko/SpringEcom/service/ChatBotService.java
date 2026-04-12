package com.telusko.SpringEcom.service;

import jakarta.annotation.PostConstruct;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.pgvector.PgVectorStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

import java.io.IOException;
import java.nio.file.Files;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ChatBotService {

    @Autowired
    private ResourceLoader resourceLoader;
    @Autowired
    private PgVectorStore vectorStore;
    @Autowired
    private ChatClient chatClient;
    @Autowired
    private ChatMemory chatMemory;

    // Cache the prompt template at startup (avoids file I/O on every request)
    private String cachedPromptTemplate;

    @PostConstruct
    public void init() {
        try {
            cachedPromptTemplate = Files.readString(
                    resourceLoader.getResource("classpath:prompts/chatbot-rag-prompt.st")
                            .getFile()
                            .toPath()
            );
        } catch (IOException e) {
            throw new RuntimeException("Failed to load chatbot prompt template", e);
        }
    }

    public String getBotResponse(String userQuery) {
        String context = fetchSemanticContext(userQuery);

        Map<String, Object> variables = new HashMap<>();
        variables.put("userQuery", userQuery);
        variables.put("context", context);

        PromptTemplate promptTemplate = PromptTemplate.builder()
                .template(cachedPromptTemplate)
                .variables(variables)
                .build();

        return chatClient.prompt(promptTemplate.create()).call().content();
    }

    /**
     * Streaming version: returns a Flux of tokens (SSE) with conversation memory.
     */
    public Flux<String> streamBotResponse(String userQuery, String conversationId) {
        String context = fetchSemanticContext(userQuery);

        Map<String, Object> variables = new HashMap<>();
        variables.put("userQuery", userQuery);
        variables.put("context", context);

        PromptTemplate promptTemplate = PromptTemplate.builder()
                .template(cachedPromptTemplate)
                .variables(variables)
                .build();

        String resolvedConversationId = (conversationId != null && !conversationId.isBlank())
                ? conversationId
                : "default";

        return chatClient.prompt(promptTemplate.create())
                .advisors(MessageChatMemoryAdvisor.builder(chatMemory)
                        .conversationId(resolvedConversationId)
                        .build())
                .stream()
                .content();
    }

    private String fetchSemanticContext(String userQuery) {
        List<Document> documents = vectorStore.similaritySearch(
                SearchRequest.builder()
                        .query(userQuery)
                        .topK(3)
                        .similarityThreshold(0.5f)
                        .build()
        );
        StringBuilder context = new StringBuilder();
        for (Document document : documents) {
            context.append(document.getFormattedContent()).append("\n");
        }
        return context.toString();
    }
}
