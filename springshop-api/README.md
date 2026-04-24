# 🛒 SpringShop AI — Backend API

## 📘 Overview

The **SpringShop AI Backend** is a Spring Boot 3 REST API that powers the SpringShop AI e-commerce platform. It provides full product & order management, AI-powered product generation & description writing via **Ollama** (local LLM), and a **RAG-based chatbot** that answers customer questions using **PgVector** semantic search combined with direct database lookups.

> **Runs 100% locally** — no paid API keys needed. Uses Ollama for chat (Mistral) and embeddings (nomic-embed-text).

---

## 📑 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Dependencies](#dependencies)
- [Architecture](#architecture)
- [API Specification](#api-specification)
  - [Products](#products)
  - [AI Features](#ai-features)
  - [Chatbot](#chatbot)
  - [Orders](#orders)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Folder Structure](#folder-structure)

---

## 🔧 Features

### Product Management
- Full CRUD lifecycle (create, read, update, delete)
- Image upload & retrieval (stored as byte arrays)
- Keyword-based product search
- Auto-sync product data into PgVector on every add/update

### AI-Powered Features (Ollama)
- **AI Product Generation** — Generate complete product JSON (name, brand, price, category, etc.) from a text prompt
- **AI Description Generation** — Auto-generate concise product descriptions
- **Streaming Description** — Stream AI-generated descriptions via SSE (Server-Sent Events)
- **AI Image Generation** — Endpoint exists but is currently unavailable with Ollama (throws `UnsupportedOperationException`; users should upload images manually)

### RAG Chatbot
- **Retrieval-Augmented Generation** — Chatbot retrieves relevant context from PgVector (semantic similarity search) before answering
- **Direct DB Order Lookup** — Chatbot detects order IDs (`ORDxxxxxxxx`) and customer names in the query, fetches matching orders directly from the database
- **Conversation Memory** — Maintains chat history (last 20 messages per session) using Spring AI `MessageWindowChatMemory`
- **Streaming Responses** — Real-time token-by-token SSE streaming

### Order Management
- Place orders with multiple items
- Auto stock deduction on order placement
- Auto-sync updated product stock & order summaries into PgVector
- Order history retrieval with item details

---

## 💡 Tech Stack

| Component | Technology |
|---|---|
| **Language** | Java 21 |
| **Framework** | Spring Boot 3.3.2 |
| **AI Integration** | Spring AI 1.1.0 (Ollama starter) |
| **LLM (Chat)** | Ollama — Mistral 7B |
| **Embeddings** | Ollama — nomic-embed-text (768 dimensions) |
| **Vector Store** | PgVector (via `spring-ai-starter-vector-store-pgvector`) |
| **ORM** | Spring Data JPA / Hibernate |
| **Database** | PostgreSQL 16 + PgVector extension |
| **Reactive** | Spring WebFlux (for SSE streaming) |
| **Containerization** | Docker Compose (auto-managed by Spring Boot) |
| **Build Tool** | Apache Maven (with included wrapper `mvnw`) |
| **Utilities** | Project Lombok |

---

## 📦 Dependencies

Key dependencies from `pom.xml`:

| Dependency | Purpose |
|---|---|
| `spring-boot-starter-web` | REST API, MVC, embedded Tomcat |
| `spring-boot-starter-webflux` | Reactive streams for SSE endpoints |
| `spring-boot-starter-data-jpa` | JPA/Hibernate ORM |
| `spring-ai-starter-model-ollama` | Ollama chat & embedding model integration |
| `spring-ai-advisors-vector-store` | Vector store advisor for RAG |
| `spring-ai-starter-vector-store-pgvector` | PgVector vector store auto-configuration |
| `spring-boot-docker-compose` | Auto-start Docker containers on boot |
| `lombok` | Boilerplate reduction (`@Data`, `@Builder`, etc.) |
| `spring-boot-starter-test` | Testing framework |
| `springdoc-openapi-starter-webmvc-ui` | Swagger UI & OpenAPI 3 documentation |

Dependency management is handled via the **Spring AI BOM** (`spring-ai-bom:1.1.0`).

---

## 🧱 Architecture

The backend follows a layered architecture:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           REST Controllers                              │
│  ProductController · OrderController · ChatBotController · HelloController
├─────────────────────────────────────────────────────────────────────────┤
│                           Service Layer                                 │
│  ProductService · OrderService · ChatBotService · AiImageGeneratorService
├─────────────────────────────────────────────────────────────────────────┤
│                       Data Access (Repositories)                        │
│  ProductRepo · OrderRepo                                                │
├─────────────────────────────────────────────────────────────────────────┤
│                        Domain Model (Entities)                          │
│  Product · Order · OrderItem · DTOs                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                       External Integrations                             │
│  Ollama (localhost:11434) · PgVector · PostgreSQL 16                    │
└─────────────────────────────────────────────────────────────────────────┘
```

### Key Flows
- **Product Add/Update** → Save to DB → Embed into PgVector
- **Order Placement** → Deduct stock → Update PgVector (product) → Save order → Embed order summary into PgVector
- **Chatbot Query** → Semantic search PgVector (top 3, threshold 0.5) + DB order lookup → Build context → Prompt Mistral with RAG template → Stream response

---

## 🔗 API Specification

### Products

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `GET` | `/api/products` | Get all products | 200 |
| `GET` | `/api/product/{id}` | Get product by ID | 200, 404 |
| `GET` | `/api/product/{productId}/image` | Get product image bytes | 200, 404 |
| `POST` | `/api/product` | Add a new product (multipart: JSON + optional image) | 201, 500 |
| `PUT` | `/api/product/{id}` | Update a product (multipart: JSON + optional image) | 200, 400 |
| `DELETE` | `/api/product/{id}` | Delete a product | 200, 404 |
| `GET` | `/api/products/search?keyword=` | Search products by keyword | 200 |

### AI Features

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `POST` | `/api/product/generate-product?query=` | Generate full product JSON from a text prompt | 200, 500 |
| `POST` | `/api/product/generate-description?name=&category=` | Generate AI product description | 200, 500 |
| `POST` | `/api/product/stream-description?name=&category=` | Stream AI description (SSE) | 200 |
| `POST` | `/api/product/generate-image?name=&category=&description=` | Generate AI product image *(unavailable with Ollama)* | 200, 500 |

### Chatbot

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `GET` | `/api/chat/ask?message=` | Ask the AI chatbot (non-streaming) | 200 |
| `POST` | `/api/chat/stream` | Stream chatbot response (SSE) with conversation memory | 200 |

**`POST /api/chat/stream`** request body:
```json
{
  "message": "What products do you have?",
  "conversationId": "optional-session-id"
}
```

### Orders

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `POST` | `/api/orders/place` | Place a new order | 201 |
| `GET` | `/api/orders` | Get all orders | 200 |

**`POST /api/orders/place`** request body:
```json
{
  "customerName": "John Doe",
  "email": "john@example.com",
  "items": [
    { "productId": 1, "quantity": 2 },
    { "productId": 3, "quantity": 1 }
  ]
}
```

---

## 🛠 Getting Started

### Prerequisites
- **Java 21** — [Download](https://adoptium.net/)
- **Docker Desktop** — [Download](https://www.docker.com/products/docker-desktop/) (for PostgreSQL + PgVector)
- **Ollama** — [Download](https://ollama.com/download) (for AI features)

### 1. Pull Ollama Models
```bash
ollama pull mistral
ollama pull nomic-embed-text
```

### 2. Start Docker (PostgreSQL + PgVector)
```bash
cd springshop-api
docker-compose up -d
```

> **Note:** Spring Boot uses `spring-boot-docker-compose` to automatically detect and start the Docker container. You can skip this step — the backend will start it for you.

This spins up **PostgreSQL 16** with PgVector:

| Setting | Value |
|---|---|
| Database | `telusko` |
| Username | `postgres` |
| Password | `0076` |
| Port | `5432` (mapped dynamically) |

### 3. Set Java 21 (if another Java version is installed system-wide)
If your system's default Java is not version 21 (e.g., Java 8 or 17), you need to point `JAVA_HOME` to a Java 21 JDK **in your current terminal session** before running the backend:
```powershell
# Windows PowerShell — set JAVA_HOME to your Java 21 installation path
$env:JAVA_HOME = "<path to JDK 21>"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"

# Verify
java -version   # Should show: openjdk version "21.x.x"
```
```bash
# macOS / Linux
export JAVA_HOME=/path/to/jdk-21
export PATH="$JAVA_HOME/bin:$PATH"

java -version   # Should show: openjdk version "21.x.x"
```
> **Tip:** You can find your installed JDKs on Windows at `%USERPROFILE%\.jdks\` (IntelliJ-managed), `C:\Program Files\Eclipse Adoptium\`, or `C:\Program Files\Java\`. On macOS/Linux, check `/usr/lib/jvm/` or use `update-alternatives --list java`.
>
> This only affects the current terminal session — it does **not** change your system-wide Java version.

### 4. Run the Backend
```bash
# Using Maven Wrapper
./mvnw spring-boot:run        # Linux / macOS
mvnw.cmd spring-boot:run      # Windows
```

The API will start at **http://localhost:8080**.

#### Swagger UI (API Documentation)
Once the backend is running, interactive API docs are available at:
- **Swagger UI**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **OpenAPI JSON**: [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

On first startup:
1. Auto-creates the `vector_store` table via `init/schema.sql` (768 dimensions for nomic-embed-text)
2. Auto-creates JPA entity tables (`spring.jpa.hibernate.ddl-auto=update`)
3. Connects to Ollama at `http://localhost:11434`

---

## ⚙️ Configuration

All configuration is in `src/main/resources/application.properties`:

```properties
# Application
spring.application.name=SpringShopAI

# Docker Compose (auto-start PostgreSQL)
spring.docker.compose.file=springshop-api/docker-compose.yml

# JPA
spring.jpa.hibernate.ddl-auto=update

# File Upload Limits
spring.servlet.multipart.max-file-size=100MB
spring.servlet.multipart.max-request-size=100MB

# Ollama
spring.ai.ollama.base-url=http://localhost:11434
spring.ai.ollama.chat.options.model=mistral
spring.ai.ollama.embedding.options.model=nomic-embed-text

# Vector Store Schema
spring.sql.init.schema-locations=classpath:init/schema.sql
spring.sql.init.mode=always
```

> ⚠️ If you change the embedding model, update the vector dimensions in `init/schema.sql` and recreate the `vector_store` table.

---

## 📂 Folder Structure

```
springshop-api/
├── docker-compose.yml                           # PostgreSQL 16 + PgVector container
├── pom.xml                                      # Maven dependencies & Spring AI BOM
├── mvnw / mvnw.cmd                              # Maven wrapper
└── src/main/
    ├── java/com/ecom/SpringEcom/
    │   ├── SpringEcomApplication.java            # Main entry point
|     │   ├── config/
|     │   │   ├── ChatClientConfig.java             # ChatClient + ChatMemory beans
|     │   │   └── OpenApiConfig.java                # Swagger / OpenAPI 3 configuration
    │   ├── controller/
    │   │   ├── ProductController.java            # Product REST API + AI endpoints
    │   │   ├── OrderController.java              # Order REST API
    │   │   ├── ChatBotController.java            # Chatbot REST API (SSE streaming)
    │   │   └── HelloController.java              # Health check
    │   ├── model/
    │   │   ├── Product.java                      # Product entity
    │   │   ├── Order.java                        # Order entity
    │   │   ├── OrderItem.java                    # Order line item entity
    │   │   └── dto/                              # Request/Response DTOs
    │   ├── repo/
    │   │   ├── ProductRepo.java                  # Product JPA repository
    │   │   └── OrderRepo.java                    # Order JPA repository (+ name search)
    │   └── service/
    │       ├── ProductService.java               # Product logic + AI generation + vector sync
    │       ├── OrderService.java                 # Order logic + stock mgmt + vector sync
    │       ├── ChatBotService.java               # RAG chatbot + DB order lookup
    │       └── AiImageGeneratorService.java      # AI image generation (stub — unsupported with Ollama)
    └── resources/
        ├── application.properties                # App + Ollama + DB configuration
        ├── init/schema.sql                       # PgVector table (768 dims)
        ├── insert-data                           # Sample product SQL
        └── prompts/
            └── chatbot-rag-prompt.st             # Chatbot system prompt template (StringTemplate)
```
