# 🛒 SpringShop AI – Full-Stack E-Commerce Application with AI-Powered Chatbot

A full-stack e-commerce web application built with **Spring Boot** (backend — `springshop-api`) and **React + Vite** (frontend — `springshop-ui`), featuring an **AI-powered customer service chatbot** using **Spring AI**, **Ollama** (local LLM), and **RAG (Retrieval-Augmented Generation)** with **PgVector** for semantic search.

> **Runs 100% locally** — no paid API keys needed. Uses Ollama for chat (Llama 3.2/mistral) and embeddings (nomic-embed-text).

---

## 📌 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Install & Set Up Ollama](#2-install--set-up-ollama)
  - [3. Set Up the Backend (Spring Boot)](#3-set-up-the-backend-spring-boot)
  - [4. Set Up the Frontend (React)](#4-set-up-the-frontend-react)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)

---

## Overview

This project is a modern e-commerce platform that combines traditional online shopping functionality with cutting-edge AI capabilities — all running locally using **Ollama**:

- **Product Management** – Full CRUD operations for products with image upload support.
- **AI-Generated Descriptions** – Product descriptions are generated locally using Ollama's Llama 3.2 model.
- **Intelligent Chatbot** – A RAG-based chatbot that can answer customer queries about products, orders, shipping, returns, and more by semantically searching a PgVector-backed vector store.
- **Order Management** – Place orders, track order history, and manage stock inventory.
- **Semantic Search** – Product and order data is embedded into a vector store (using nomic-embed-text) so the chatbot can retrieve contextually relevant information.

> **Note:** AI image generation (DALL-E) is **not available** with Ollama. Product images must be uploaded manually.

---

## Architecture

```
┌──────────────────────┐        HTTP/REST         ┌──────────────────────────┐
│                      │ ◄──────────────────────► │                          │
│   React Frontend     │    (axios, port 5173)     │   Spring Boot Backend    │
│   (Vite + Bootstrap) │                           │   (port 8080)            │
│                      │                           │                          │
└──────────────────────┘                           │  ┌────────────────────┐  │
                                                   │  │  Product Service   │  │
                                                   │  │  Order Service     │  │
                                                   │  │  ChatBot Service   │  │
                                                   │  └────────┬───────────┘  │
                                                   │           │              │
                                                   │  ┌────────▼───────────┐  │
                                                   │  │  PostgreSQL +      │  │
                                                   │  │  PgVector (Docker) │  │
                                                   │  └────────────────────┘  │
                                                   │           │              │
                                                   │  ┌────────▼───────────┐  │
                                                   │  │  Ollama (Local)    │  │
                                                   │  │  - llama3.2 (chat) │  │
                                                   │  │  - nomic-embed-text│  │
                                                   │  │    (embeddings)    │  │
                                                   │  └────────────────────┘  │
                                                   └──────────────────────────┘
```

---

## Features

| Feature | Description |
|---|---|
| **Product CRUD** | Add, update, delete, and view products with image upload |
| **AI Product Description** | Auto-generate product descriptions via Ollama (Llama 3.2) |
| ~~AI Product Image~~ | ⚠️ Not available with Ollama (no DALL-E equivalent) — upload images manually |
| **Product Search** | Keyword-based product search |
| **Shopping Cart** | Add products to cart and manage quantities |
| **Order Placement** | Checkout with customer details, auto stock deduction |
| **Order History** | View all placed orders |
| **AI Chatbot (RAG)** | Ask questions about products, orders, shipping, returns — the chatbot retrieves relevant data from PgVector and responds using Llama 3.2 |
| **Vector Store Sync** | Product and order data are automatically embedded into PgVector (via nomic-embed-text) for chatbot context |

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Java 21** | Programming language |
| **Spring Boot 3.3.2** | Application framework |
| **Spring AI 1.1.0** | AI/LLM integration (Ollama, vector store, embeddings) |
| **Spring Data JPA** | ORM / database access |
| **PostgreSQL + PgVector** | Relational database with vector similarity search |
| **Docker Compose** | Container orchestration for PostgreSQL |
| **Lombok** | Boilerplate code reduction |
| **Ollama – Llama 3.2** | Local LLM for chat completion & description generation |
| **Ollama – nomic-embed-text** | Local text embeddings for vector store (768 dimensions) |

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI library |
| **Vite** | Build tool & dev server |
| **React Router DOM** | Client-side routing |
| **Axios** | HTTP client for API calls |
| **Bootstrap 5 + React Bootstrap** | Styling & UI components |
| **@chatscope/chat-ui-kit-react** | Chat UI for the AI chatbot |
| **React Toastify** | Toast notifications |
| **React Icons + Bootstrap Icons** | Iconography |

---

## Prerequisites

Before running the project, make sure you have the following installed:

- **Java 21** – [Download](https://adoptium.net/)
- **Maven 3.8+** (or use the included `mvnw` wrapper)
- **Node.js 18+** and **npm** – [Download](https://nodejs.org/)
- **Docker Desktop** – [Download](https://www.docker.com/products/docker-desktop/) (required for PostgreSQL + PgVector)
- **Ollama** – [Download](https://ollama.com/download) (required for AI features)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd SpringShopAI
```

### 2. Install & Set Up Ollama

#### a. Install Ollama

Download and install from [https://ollama.com/download](https://ollama.com/download)

Verify the installation:
```bash
ollama --version
```

#### b. Pull the Required Models

You need **two models** — one for chat and one for embeddings:

```bash
# Chat model (Llama 3.2 – ~2GB)
ollama pull llama3.2

# Embedding model (nomic-embed-text – ~274MB)
ollama pull nomic-embed-text
```

#### c. Start Ollama

Ollama usually runs automatically after installation. Verify it's running:

```bash
ollama list
```

You should see both `llama3.2` and `nomic-embed-text` listed. Ollama serves on **http://localhost:11434** by default.

> **Tip:** You can test the chat model with: `ollama run llama3.2 "Hello!"`

### 3. Set Up the Backend (Spring Boot)

#### a. Start Docker (PostgreSQL + PgVector)

Make sure Docker Desktop is running, then:

```bash
cd springshop-api
docker-compose up -d
```

This spins up a **PostgreSQL 16** instance with the **PgVector** extension on port **5432** with:
- **Database:** `telusko`
- **Username:** `postgres`
- **Password:** `0076`

> **Note:** The Spring Boot app uses `spring-boot-docker-compose` to automatically detect and connect to the Docker Compose services at startup. So you can also skip this step — Spring Boot will start the container for you.

#### b. Run the Backend

```bash
cd springshop-api

# Using Maven Wrapper (recommended)
./mvnw spring-boot:run        # Linux/macOS
mvnw.cmd spring-boot:run      # Windows
```

The backend API will start at **http://localhost:8080**.

On first startup, the app will:
1. Auto-create the `vector_store` table with the PgVector extension (`init/schema.sql`) — uses 768 dimensions for nomic-embed-text.
2. Auto-create JPA entity tables (`spring.jpa.hibernate.ddl-auto=update`).
3. Connect to Ollama at `http://localhost:11434`.

> **No API key needed!** Everything runs locally via Ollama.

#### c. (Optional) Insert Sample Data

You can manually insert sample products using the SQL in `springshop-api/src/main/resources/insert-data`:

```sql
INSERT INTO product (name, description, brand, price, category, release_date, product_available, stock_quantity) VALUES
('iPhone 14', 'Latest Apple iPhone', 'Apple', 999.99, 'phone', '2023-01-01', true, 50),
('Galaxy S22', 'Latest Samsung Galaxy', 'Samsung', 899.99, 'phone', '2023-02-01', true, 30),
('MacBook Pro', 'Apple MacBook Pro 16-inch', 'Apple', 2399.99, 'laptop', '2023-03-01', true, 20),
('Dell XPS 13', 'Dell XPS 13 Ultrabook', 'Dell', 1299.99, 'laptop', '2023-04-01', true, 25),
('Levi Jeans', 'Classic Levi Jeans', 'Levi', 59.99, 'fashion', '2023-05-01', true, 100),
('Lego Set', 'Lego Star Wars Set', 'Lego', 79.99, 'toy', '2023-06-01', true, 40);
```

### 4. Set Up the Frontend (React)

```bash
cd springshop-ui

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start at **http://localhost:5173**.

> The frontend communicates with the backend API at `http://localhost:8080/api` (configured in `src/axios.jsx`).

---

## API Endpoints

### Products

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | Get all products |
| `GET` | `/api/product/{id}` | Get product by ID |
| `GET` | `/api/product/{id}/image` | Get product image |
| `POST` | `/api/product` | Add a new product (multipart: product JSON + image file) |
| `PUT` | `/api/product/{id}` | Update a product |
| `DELETE` | `/api/product/{id}` | Delete a product |
| `GET` | `/api/products/search?keyword=` | Search products by keyword |

### AI Features

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/product/generate-description?name=&category=` | Generate AI product description (Ollama – Llama 3.2) |
| `POST` | `/api/product/generate-image?name=&category=&description=` | ⚠️ Not available with Ollama – returns error |

### Chatbot

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/chat/ask?message=` | Ask the AI chatbot a question (Ollama – Llama 3.2 + RAG) |

### Orders

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/orders/place` | Place a new order |
| `GET` | `/api/orders` | Get all orders |

---

## Project Structure

```
SpringShopAI/
│
├── springshop-api/                        # Backend (Spring Boot)
│   ├── docker-compose.yml                 # PostgreSQL + PgVector container
│   ├── pom.xml                            # Maven dependencies (Ollama + PgVector)
│   ├── mvnw / mvnw.cmd                   # Maven wrapper
│   └── src/main/
│       ├── java/com/telusko/SpringEcom/
│       │   ├── SpringEcomApplication.java # Main entry point
│       │   ├── config/
│       │   │   └── ChatClientConfig.java  # Spring AI ChatClient bean
│       │   ├── controller/
│       │   │   ├── ProductController.java # Product REST API
│       │   │   ├── OrderController.java   # Order REST API
│       │   │   ├── ChatBotController.java # Chatbot REST API (+ SSE streaming)
│       │   │   └── HelloController.java   # Health check
│       │   ├── model/
│       │   │   ├── Product.java           # Product entity
│       │   │   ├── Order.java             # Order entity
│       │   │   ├── OrderItem.java         # Order item entity
│       │   │   └── dto/                   # Request/Response DTOs
│       │   ├── repo/                      # JPA Repositories
│       │   └── service/
│       │       ├── ProductService.java    # Product logic + AI description + vector sync
│       │       ├── OrderService.java      # Order logic + vector sync
│       │       ├── ChatBotService.java    # RAG chatbot with PgVector context
│       │       └── AiImageGeneratorService.java  # Disabled (Ollama has no image gen)
│       └── resources/
│           ├── application.properties     # Ollama + app configuration
│           ├── init/schema.sql            # PgVector table (768 dim for nomic-embed-text)
│           ├── insert-data                # Sample product data
│           └── prompts/
│               └── chatbot-rag-prompt.st  # Chatbot system prompt template
│
├── springshop-ui/                         # Frontend (React + Vite)
│   ├── package.json                       # Node dependencies
│   ├── vite.config.js                     # Vite configuration
│   └── src/
│       ├── App.jsx                        # Root component with routing
│       ├── main.jsx                       # App entry point
│       ├── axios.jsx                      # Axios API configuration
│       ├── components/
│       │   ├── Home.jsx                   # Product listing homepage
│       │   ├── Navbar.jsx                 # Navigation bar with search
│       │   ├── Product.jsx                # Single product view
│       │   ├── AddProduct.jsx             # Add product form (with AI description gen)
│       │   ├── UpdateProduct.jsx          # Update product form
│       │   ├── Cart.jsx                   # Shopping cart
│       │   ├── CheckoutPopup.jsx          # Checkout modal
│       │   ├── Order.jsx                  # Order history
│       │   ├── AskAI.jsx                  # AI Chatbot interface (SSE streaming)
│       │   └── SearchResults.jsx          # Product search results
│       └── Context/
│           └── Context.jsx                # React Context (global state)
│
└── README.md                              # This file
```

---

## 🔧 Using a Different Ollama Model

You can swap models by editing `springshop-api/src/main/resources/application.properties`:

```properties
# Chat model – try larger models for better quality
spring.ai.ollama.chat.options.model=llama3.2        # Default (3B, ~2GB)
# spring.ai.ollama.chat.options.model=llama3.1       # 8B, ~4.7GB
# spring.ai.ollama.chat.options.model=mistral        # 7B, ~4.1GB

# Embedding model
spring.ai.ollama.embedding.options.model=nomic-embed-text  # 768 dims
# spring.ai.ollama.embedding.options.model=mxbai-embed-large  # 1024 dims (update schema.sql too!)
```

> ⚠️ If you change the embedding model, you **must** also update the vector dimension in `init/schema.sql` and recreate the `vector_store` table.

---

## 📝 Notes

- **No API keys required!** Everything runs locally via Ollama.
- The backend automatically manages the PgVector vector store — every product add/update and order placement syncs data into the vector store for the chatbot.
- The chatbot uses a **RAG** approach: it performs a similarity search (top 5, threshold 0.7) on the vector store and injects the relevant context into the Llama 3.2 prompt.
- **AI image generation is not available** with Ollama. The "Generate with AI" image button on the frontend will return an error. Upload product images manually instead.
- AI description generation works fully with Ollama (Llama 3.2).
- File uploads support up to **100MB** per file.
- The app uses **Spring Boot Docker Compose** integration — if Docker is running, it will automatically start the PostgreSQL container
