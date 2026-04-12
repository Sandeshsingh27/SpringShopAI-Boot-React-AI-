package com.telusko.SpringEcom.service;

import org.springframework.stereotype.Service;

@Service
public class AiImageGeneratorService {

    /**
     * Ollama does not support image generation (no DALL-E equivalent).
     * This feature is unavailable when running with Ollama.
     * Users must upload product images manually.
     */
    public byte[] generateImage(String imagePrompt) {
        throw new UnsupportedOperationException(
                "AI image generation is not available with Ollama. " +
                "Please upload a product image manually."
        );
    }
}
