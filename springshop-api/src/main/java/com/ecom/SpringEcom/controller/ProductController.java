package com.ecom.SpringEcom.controller;

import com.ecom.SpringEcom.model.Product;
import com.ecom.SpringEcom.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Flux;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin
@Tag(name = "Products", description = "Product CRUD operations and product search")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Operation(summary = "Get all products", description = "Retrieves a list of all products in the catalog.")
    @GetMapping("/products")
    public ResponseEntity<List<Product>> getProducts(){
        return new ResponseEntity<>(productService.getAllProducts(), HttpStatus.OK);

    }

    @Operation(summary = "Get product by ID", description = "Retrieves a single product by its ID. Returns 404 if not found.")
    @GetMapping("/product/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable int id){
        Product product = productService.getProductById(id);

        if(product.getId() > 0)
            return new ResponseEntity<>(product, HttpStatus.OK);
        else
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);

    }

    @Operation(summary = "Get product image", description = "Returns the raw image bytes for a product by its ID. Returns 404 if the product does not exist.")
    @GetMapping("product/{productId}/image")
    public ResponseEntity<byte[]> getImageByProductId(@PathVariable int productId){
        Product product = productService.getProductById(productId);
        if(product.getId() > 0)
            return new ResponseEntity<>(product.getImageData(), HttpStatus.OK);
        else
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @Operation(summary = "Generate product via AI", description = "Generates a complete product JSON (name, brand, price, category, description, etc.) from a text prompt using the Ollama Mistral LLM.")
    @PostMapping("/product/generate-product")
    public ResponseEntity<String> generateProduct(@RequestParam String query){
        try{
            String aiProduct = productService.generateProduct(query);
            return ResponseEntity.ok()
                    .header("Content-Type", "application/json")
                    .body(aiProduct);
        }catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "Generate product description via AI", description = "Generates a concise, customer-friendly product description (max 250 chars) using Ollama Mistral, given a product name and category.")
    @PostMapping("/product/generate-description")
    public ResponseEntity<String> generateDescription(@RequestParam String name, @RequestParam String category){

        try{
            String aiDesc = productService.generateDescription(name,category);
            return new ResponseEntity<>(aiDesc, HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @Operation(summary = "Stream product description via AI (SSE)", description = "Streams an AI-generated product description token-by-token as Server-Sent Events (SSE) using Ollama Mistral.")
    @PostMapping(value = "/product/stream-description", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> streamDescription(@RequestParam String name, @RequestParam String category) {
        return productService.streamDescription(name, category)
                .onErrorComplete();
    }

    @Operation(summary = "Generate product image via AI", description = "Generates a professional e-commerce product image using AI. Note: Currently unavailable with Ollama — upload images manually instead.")
    @PostMapping("/product/generate-image")
    public ResponseEntity<?> generateImage(@RequestParam String name, @RequestParam String category, @RequestParam String description){
        try{
            byte[] aiImage = productService.generateImage(name, category, description);
            return new ResponseEntity<>(aiImage, HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @Operation(summary = "Add a new product", description = "Creates a new product with optional image upload. The product data is also embedded into the PgVector store for chatbot RAG retrieval.")
    @PostMapping("/product")
    public ResponseEntity<?> addProduct(@RequestPart Product product, @RequestPart(required = false) MultipartFile imageFile){
        Product savedProduct = null;
        try {
            savedProduct = productService.addOrUpdateProduct(product, imageFile);
            return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "Update a product", description = "Updates an existing product by ID with optional image replacement. The updated product data is re-embedded into PgVector.")
    @PutMapping("/product/{id}")
    public ResponseEntity<String> updateProduct(@PathVariable int id, @RequestPart Product product, @RequestPart @Nullable MultipartFile imageFile){
        Product updatedProduct = null;
        try{
            updatedProduct = productService.addOrUpdateProduct(product, imageFile);
            return new ResponseEntity<>("Updated", HttpStatus.OK);
        }
        catch (IOException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Delete a product", description = "Deletes a product by its ID. Returns 404 if the product does not exist.")
    @DeleteMapping("/product/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable int id){
        Product product = productService.getProductById(id);
        if(product != null){
            productService.deleteProduct(id);
            return new ResponseEntity<>("Deleted", HttpStatus.OK);
        }
        else
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);


    }

    @Operation(summary = "Search products by keyword", description = "Searches for products matching the given keyword across name, description, brand, and category fields.")
    @GetMapping("/products/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String keyword){
        List<Product> products = productService.searchProducts(keyword);
        System.out.println("searching with " + keyword);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

}
