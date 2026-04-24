package com.ecom.SpringEcom.controller;

import com.ecom.SpringEcom.model.dto.ChatRequest;
import com.ecom.SpringEcom.service.ChatBotService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin
@Tag(name = "Chatbot", description = "AI-powered RAG chatbot for customer queries about products, orders, shipping, and returns")
public class ChatBotController {

    @Autowired
    private ChatBotService chatBotService;

    @Operation(summary = "Ask the chatbot (non-streaming)", description = "Sends a message to the AI chatbot and returns the full response at once. Uses RAG with PgVector semantic search and direct database order lookups.")
    @GetMapping("/ask")
    public ResponseEntity<String> askBot(@RequestParam String message){

        String response = chatBotService.getBotResponse(message);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Stream chatbot response (SSE)", description = "Sends a message to the AI chatbot and streams the response token-by-token as Server-Sent Events (SSE). Supports conversation memory (last 20 messages per session) via conversationId.")
    @PostMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> chatStream(@RequestBody ChatRequest req) {
        return chatBotService.streamBotResponse(req.message(), req.conversationId())
                .onErrorComplete();
    }
}
