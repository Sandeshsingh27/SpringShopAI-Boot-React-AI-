package com.ecom.SpringEcom.service;

import com.ecom.SpringEcom.model.Order;
import com.ecom.SpringEcom.model.OrderItem;
import com.ecom.SpringEcom.repo.OrderRepo;
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
import java.util.*;

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
    @Autowired
    private OrderRepo orderRepo;

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
        String context = buildFullContext(userQuery);

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
        String context = buildFullContext(userQuery);

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

    /**
     * Combines semantic (vector) context with direct DB order lookups.
     */
    private String buildFullContext(String userQuery) {
        String semanticContext = fetchSemanticContext(userQuery);
        String orderContext = fetchOrderContext(userQuery);

        StringBuilder combined = new StringBuilder();
        if (!semanticContext.isBlank()) {
            combined.append(semanticContext);
        }
        if (!orderContext.isBlank()) {
            combined.append("\n").append(orderContext);
        }
        return combined.toString();
    }

    /**
     * Searches the database for orders matching customer name or order ID
     * found in the user query, so the AI can answer order-related questions.
     */
    private String fetchOrderContext(String userQuery) {
        Set<Order> matchedOrders = new LinkedHashSet<>();

        // Check if the query contains an order ID (e.g. ORD2CEF0D09)
        for (String word : userQuery.split("\\s+")) {
            if (word.toUpperCase().startsWith("ORD")) {
                orderRepo.findByOrderId(word.toUpperCase()).ifPresent(matchedOrders::add);
            }
        }

        // Search by customer name: try each word (3+ chars) as a name fragment
        String[] words = userQuery.split("\\s+");
        for (String word : words) {
            String cleaned = word.replaceAll("[^a-zA-Z]", "");
            if (cleaned.length() >= 3) {
                List<Order> found = orderRepo.findByCustomerNameContainingIgnoreCase(cleaned);
                matchedOrders.addAll(found);
            }
        }

        if (matchedOrders.isEmpty()) return "";

        StringBuilder sb = new StringBuilder("Order records from database:\n");
        for (Order order : matchedOrders) {
            sb.append("\nOrder ID: ").append(order.getOrderId())
              .append("\nCustomer: ").append(order.getCustomerName())
              .append("\nEmail: ").append(order.getEmail())
              .append("\nDate: ").append(order.getOrderDate())
              .append("\nStatus: ").append(order.getStatus())
              .append("\nProducts:\n");
            if (order.getOrderItems() != null) {
                for (OrderItem item : order.getOrderItems()) {
                    sb.append("  - ").append(item.getProduct().getName())
                      .append(" x ").append(item.getQuantity())
                      .append(" = $").append(item.getTotalPrice())
                      .append("\n");
                }
            }
        }
        return sb.toString();
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
