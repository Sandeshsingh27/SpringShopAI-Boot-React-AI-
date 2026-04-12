package com.ecom.SpringEcom.model.dto;

public record OrderItemRequest(
        int productId,
        int quantity
) {}
