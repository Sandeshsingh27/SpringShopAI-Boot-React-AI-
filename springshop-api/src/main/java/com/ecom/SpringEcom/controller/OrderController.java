package com.ecom.SpringEcom.controller;

import com.ecom.SpringEcom.model.dto.OrderRequest;
import com.ecom.SpringEcom.model.dto.OrderResponse;
import com.ecom.SpringEcom.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin
@Tag(name = "Orders", description = "Order placement and order history")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Operation(summary = "Place a new order", description = "Places a new order with the given customer details and item list. Automatically deducts stock, updates the PgVector store with the new stock levels, and embeds the order summary for chatbot retrieval.")
    @PostMapping("/orders/place")
    public ResponseEntity<OrderResponse> placeOrder(@RequestBody OrderRequest orderRequest) {
        OrderResponse orderResponse = orderService.placeOrder(orderRequest);
        return new ResponseEntity<>(orderResponse, HttpStatus.CREATED);
    }

    @Operation(summary = "Get all orders", description = "Retrieves a list of all placed orders with their item details, customer info, and status.")
    @GetMapping("/orders")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        List<OrderResponse> orderResponseList = orderService.getAllOrderResponses();
        return new ResponseEntity<>(orderResponseList, HttpStatus.OK);
    }
}
