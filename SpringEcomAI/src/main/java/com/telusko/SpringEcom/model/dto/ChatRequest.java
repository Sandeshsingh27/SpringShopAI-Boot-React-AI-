package com.telusko.SpringEcom.model.dto;

public record ChatRequest(
        String message,
        String conversationId
) {}

