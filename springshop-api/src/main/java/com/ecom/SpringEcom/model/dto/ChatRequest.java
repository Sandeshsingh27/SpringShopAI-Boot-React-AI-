package com.ecom.SpringEcom.model.dto;

public record ChatRequest(
        String message,
        String conversationId
) {}

