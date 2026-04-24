package com.ecom.SpringEcom.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Health Check", description = "Basic health check endpoint")
public class HelloController {

    @Operation(summary = "Health check", description = "Returns a welcome message to verify the API is running.")
    @GetMapping("/hello")
    public String greet(){
        return "Welcome to Spring E-commerce API!";
    }

}
