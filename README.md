# ⚡ SpringShop AI
### Full-Stack E-Commerce Platform with AI-Powered Chatbot
A modern e-commerce web application built with **Spring Boot 3** (backend) and **React + Vite** (frontend), featuring an **AI-powered customer service chatbot** using **Spring AI**, **Ollama** (local LLM), and **RAG (Retrieval-Augmented Generation)** with **PgVector** for semantic search.
> **Runs 100% locally** — no paid API keys needed. Uses Ollama for chat (Mistral) and embeddings (nomic-embed-text).
![Java](https://img.shields.io/badge/Java-21-orange?logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.2-brightgreen?logo=springboot)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Ollama](https://img.shields.io/badge/Ollama-Mistral-purple)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-PgVector-336791?logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)
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
  - [3. Set Up the Backend](#3-set-up-the-backend-spring-boot)
  - [4. Set Up the Frontend](#4-set-up-the-frontend-react--vite)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
---
## Overview
SpringShop AI is a modern e-commerce platform that combines traditional online shopping with cutting-edge AI capabilities — all running locally:
- **Product Management** — Full CRUD with image upload and AI-generated descriptions & images
- **AI Product Generation** — Generate complete product listings from a text prompt using Ollama Mistral
- **Intelligent Chatbot** — RAG-based chatbot that answers questions about products, orders, shipping & returns by semantically searching a PgVector vector store
- **Order Management** — Place orders, track history, and manage stock (with AI-aware inventory updates)
- **Order Lookup by Name** — The chatbot can find orders by customer name or order ID directly from the database
- **Semantic Search** — Product and order data are automatically embedded into PgVector for contextual AI retrieval
---
## Architecture
```
+-----------------------+        HTTP/REST          +----------------------------+
|                       | <-----------------------> |                            |
|   React Frontend      |    (fetch/axios, :5173)   |   Spring Boot Backend      |
|   (Vite + Bootstrap)  |                           |   (port 8080)              |
|                       |                           |                            |
+-----------------------+                           |  +----------------------+  |
                                                    |  |  Product Service     |  |
                                                    |  |  Order Service       |  |
                                                    |  |  ChatBot Service     |  |
                                                    |  +----------+-----------+  |
                                                    |             |              |
                                                    |  +----------v-----------+  |
                                                    |  |  PostgreSQL 16 +     |  |
                                                    |  |  PgVector (Docker)   |  |
                                                    |  +----------------------+  |
                                                    |             |              |
                                                    |  +----------v-----------+  |
                                                    |  |  Ollama (Local)      |  |
                                                    |  |  - mistral (chat)    |  |
                                                    |  |  - nomic-embed-text  |  |
                                                    |  |    (embeddings)      |  |
                                                    |  +----------------------+  |
                                                    +----------------------------+
```
---
## Features
| Feature | Description |
|---|---|
| 🛍️ **Product CRUD** | Add, update, delete, and view products with image upload |
| 🤖 **AI Product Generation** | Generate full product details (name, brand, price, description, category) from a text prompt |
| ✍️ **AI Description Generation** | Auto-generate or stream product descriptions via Ollama Mistral |
| 🖼️ **AI Image Generation** | Generate product images using AI |
| 🔍 **Product Search** | Keyword-based product search |
| 🛒 **Shopping Cart** | Add products, manage quantities, persistent via localStorage |
| 📦 **Order Placement** | Checkout with customer details, auto stock deduction |
| 📋 **Order History** | View all placed orders with expandable item details |
| 💬 **AI Chatbot (RAG)** | Ask about products, orders, shipping, returns — chatbot retrieves context from PgVector + DB |
| 🔎 **Order Lookup by Name** | Chatbot can find orders by customer name or order ID |
| 📊 **Vector Store Sync** | Product & order data are auto-embedded into PgVector for chatbot context |
| 📝 **Swagger UI** | Interactive API documentation via SpringDoc OpenAPI 3 |
| 🏷️ **Category Filtering** | Filter products by category from the navbar dropdown |
| 🎨 **Modern UI** | Gradient theme, animations, hover effects, stock badges, responsive design |
---
## Tech Stack
### Backend (`springshop-api`)
| Technology | Purpose |
|---|---|
| **Java 21** | Programming language |
| **Spring Boot 3.3.2** | Application framework |
| **Spring AI 1.1.0** | AI/LLM integration (Ollama, vector store, embeddings) |
| **Spring Data JPA** | ORM / database access |
| **PostgreSQL 16 + PgVector** | Relational database with vector similarity search |
| **Docker Compose** | Container orchestration for PostgreSQL |
| **Lombok** | Boilerplate code reduction |
| **SpringDoc OpenAPI** | Swagger UI & OpenAPI 3 API documentation |
| **Ollama — Mistral** | Local LLM for chat, description & product generation |
| **Ollama — nomic-embed-text** | Local text embeddings for vector store (768 dimensions) |
### Frontend (`springshop-ui`)
| Technology | Purpose |
|---|---|
| **React 18** | UI library |
| **Vite** | Build tool & dev server |
| **React Router DOM** | Client-side routing |
| **Axios** | HTTP client for API calls |
| **Bootstrap 5 + React Bootstrap** | Styling & UI components |
| **@chatscope/chat-ui-kit-react** | Chat UI for the AI chatbot |
| **React Toastify** | Toast notifications |
| **Bootstrap Icons** | Iconography |
---
## Prerequisites
Before running the project, make sure you have:
- **Java 21** — [Download](https://adoptium.net/)
- **Maven 3.8+** (or use the included `mvnw` wrapper)
- **Python 3.8+** — [Download](https://python.org/downloads) (for the frontend Node.js setup via `nodeenv`)
- **Docker Desktop** — [Download](https://www.docker.com/products/docker-desktop/) (required for PostgreSQL + PgVector)
- **Ollama** — [Download](https://ollama.com/download) (required for AI features)
---
## Getting Started
### 1. Clone the Repository
```bash
git clone <repository-url>
cd "SpringShopAI [Boot+React+AI]"
```
---
### 2. Install & Set Up Ollama
#### a. Install Ollama
Download and install from [https://ollama.com/download](https://ollama.com/download)
```bash
ollama --version
```
#### b. Pull the Required Models
```bash
# Chat model (Mistral 7B)
ollama pull mistral
# Embedding model (nomic-embed-text)
ollama pull nomic-embed-text
```
#### c. Verify Ollama is Running
```bash
ollama list
```
You should see both `mistral` and `nomic-embed-text` listed. Ollama serves on **http://localhost:11434** by default.
> **Tip:** Test the chat model: `ollama run mistral "Hello!"`
---
### 3. Set Up the Backend (Spring Boot)
#### a. Start Docker (PostgreSQL + PgVector)
Make sure Docker Desktop is running, then:
```bash
cd springshop-api
docker-compose up -d
```
This spins up a **PostgreSQL 16** instance with the **PgVector** extension:
| Setting | Value |
|---|---|
| Database | `telusko` |
| Username | `postgres` |
| Password | `0076` |
> **Note:** Spring Boot uses `spring-boot-docker-compose` to automatically detect and start the Docker container. You can skip this step — the backend will start it for you.
#### b. Run the Backend
```bash
cd springshop-api
# Using Maven Wrapper
./mvnw spring-boot:run        # Linux / macOS
mvnw.cmd spring-boot:run      # Windows
```
The backend API will start at **http://localhost:8080**.

#### Swagger UI (API Documentation)
Once running, explore all endpoints interactively:
- **Swagger UI**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **OpenAPI JSON**: [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

On first startup, the app will:
1. Auto-create the `vector_store` table via `init/schema.sql` (768 dimensions for nomic-embed-text)
2. Auto-create JPA entity tables (`spring.jpa.hibernate.ddl-auto=update`)
3. Connect to Ollama at `http://localhost:11434`
> **No API keys needed!** Everything runs locally via Ollama.
---
### 4. Set Up the Frontend (React + Vite)
The frontend uses a **Python virtual environment** with `nodeenv` to install Node.js — this keeps everything isolated and reproducible.
#### Step 1 — Verify Python 3.8+
```bash
python --version
```
Install if missing: [https://python.org/downloads](https://python.org/downloads)
Linux: `sudo apt install python3 python3-venv -y`
#### Step 2 — Create a Python virtual environment
```bash
python -m venv .venv
```
#### Step 3 — Activate the virtual environment
```powershell
# Windows PowerShell
.\.venv\Scripts\Activate.ps1
# macOS / Linux
source .venv/bin/activate
```
Your terminal prompt changes to `(.venv)` — you are now inside the isolated environment.
> **Windows — if script execution is blocked:**
> ```powershell
> Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
> ```
#### Step 4 — Install nodeenv
```bash
pip install nodeenv
```
#### Step 5 — Install the latest Node.js into the venv
```bash
nodeenv --node=latest --prebuilt -p
```
This downloads the latest Node.js binary directly into `.venv/Scripts/` (Windows) or `.venv/bin/` (macOS/Linux). Verify:
```bash
node --version    # e.g. v25.x.x
npm  --version    # e.g. 11.x.x
```
> **Windows only — if `node` is not found after activation:**
> ```powershell
> $env:PATH = "$(Resolve-Path '.\.venv\Scripts');$env:PATH"
> node --version
> ```
#### Step 6 — Install npm packages
```bash
cd springshop-ui
npm install
```
#### Step 7 — Start the dev server
```bash
npm run dev
```
Open **http://localhost:5173** 🎉
> ⚠️ Make sure the Spring Boot backend is already running on port `8080` before opening the UI.
---
## API Endpoints
### Products
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | Get all products |
| `GET` | `/api/product/{id}` | Get product by ID |
| `GET` | `/api/product/{id}/image` | Get product image |
| `POST` | `/api/product` | Add a new product (multipart: JSON + optional image) |
| `PUT` | `/api/product/{id}` | Update a product |
| `DELETE` | `/api/product/{id}` | Delete a product |
| `GET` | `/api/products/search?keyword=` | Search products by keyword |
### AI Features
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/product/generate-product?query=` | Generate full product JSON from a text prompt (Mistral) |
| `POST` | `/api/product/generate-description?name=&category=` | Generate AI product description |
| `POST` | `/api/product/stream-description?name=&category=` | Stream AI description (SSE) |
| `POST` | `/api/product/generate-image?name=&category=&description=` | Generate AI product image |
### Chatbot
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/chat/ask?message=` | Ask the AI chatbot (non-streaming) |
| `POST` | `/api/chat/stream` | Stream chatbot response (SSE) with conversation memory |
### Orders
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/orders/place` | Place a new order |
| `GET` | `/api/orders` | Get all orders |
---
## Project Structure
```
SpringShopAI [Boot+React+AI]/
|
+-- springshop-api/                          # Backend (Spring Boot)
|   +-- docker-compose.yml                   # PostgreSQL + PgVector container
|   +-- pom.xml                              # Maven dependencies
|   +-- mvnw / mvnw.cmd                     # Maven wrapper
|   +-- src/main/
|       +-- java/com/ecom/SpringEcom/
|       |   +-- SpringEcomApplication.java   # Main entry point
|       |   +-- config/
|       |   |   +-- ChatClientConfig.java    # Spring AI ChatClient + ChatMemory beans
|       |   |   +-- OpenApiConfig.java       # Swagger / OpenAPI 3 configuration
|       |   +-- controller/
|       |   |   +-- ProductController.java   # Product REST API + AI endpoints
|       |   |   +-- OrderController.java     # Order REST API
|       |   |   +-- ChatBotController.java   # Chatbot REST API (SSE streaming)
|       |   |   +-- HelloController.java     # Health check
|       |   +-- model/
|       |   |   +-- Product.java             # Product entity
|       |   |   +-- Order.java               # Order entity
|       |   |   +-- OrderItem.java           # Order item entity
|       |   |   +-- dto/                     # Request/Response DTOs
|       |   +-- repo/
|       |   |   +-- ProductRepo.java         # Product JPA repository
|       |   |   +-- OrderRepo.java           # Order JPA repository (+ name search)
|       |   +-- service/
|       |       +-- ProductService.java      # Product logic + AI generation + vector sync
|       |       +-- OrderService.java        # Order logic + vector sync
|       |       +-- ChatBotService.java      # RAG chatbot + DB order lookup
|       |       +-- AiImageGeneratorService.java  # AI image generation
|       +-- resources/
|           +-- application.properties       # Ollama + app configuration
|           +-- init/schema.sql              # PgVector table (768 dims)
|           +-- insert-data                  # Sample product SQL
|           +-- prompts/
|               +-- chatbot-rag-prompt.st    # Chatbot system prompt template
|
+-- springshop-ui/                           # Frontend (React + Vite)
|   +-- package.json                         # Node dependencies
|   +-- vite.config.js                       # Vite configuration
|   +-- index.html                           # HTML entry point
|   +-- src/
|       +-- App.jsx                          # Root component with routing
|       +-- main.jsx                         # App entry point
|       +-- axios.jsx                        # Axios API configuration
|       +-- styles/
|       |   +-- custom.css                   # Custom design system (gradients, animations)
|       +-- components/
|       |   +-- Home.jsx                     # Product listing with hero banner
|       |   +-- Navbar.jsx                   # Gradient navbar with cart badge & categories
|       |   +-- Product.jsx                  # Product detail page
|       |   +-- AddProduct.jsx               # Add product form (AI generation)
|       |   +-- UpdateProduct.jsx            # Update product form
|       |   +-- Cart.jsx                     # Shopping cart
|       |   +-- CheckoutPopup.jsx            # Checkout modal
|       |   +-- Order.jsx                    # Order history & management
|       |   +-- AskAI.jsx                    # AI Chatbot (SSE streaming)
|       |   +-- SearchResults.jsx            # Product search results
|       |   +-- Footer.jsx                   # Site footer
|       +-- Context/
|           +-- Context.jsx                  # React Context (global state + cart)
|
+-- README.md                                # This file
```
---
## Configuration
### Ollama Models
You can swap models by editing `springshop-api/src/main/resources/application.properties`:
```properties
# Chat model
spring.ai.ollama.chat.options.model=mistral           # Default (7B)
# spring.ai.ollama.chat.options.model=llama3.2        # 3B (lighter)
# Embedding model
spring.ai.ollama.embedding.options.model=nomic-embed-text   # 768 dims
```
> ⚠️ If you change the embedding model dimensions, update the vector size in `init/schema.sql` and recreate the `vector_store` table.
### Environment Variables
Create a `.env` file in `springshop-ui/` to configure the backend URL:
```env
VITE_BASE_URL=http://localhost:8080
```
---
## 📝 Notes
- **No API keys required** — everything runs locally via Ollama.
- The backend automatically syncs product & order data into PgVector on every add/update/order placement.
- The chatbot uses **RAG** (semantic vector search) combined with **direct database lookups** for order queries.
- The chatbot supports **conversation memory** (last 20 messages per session).
- Image upload is **optional** when adding products — you can also generate images with AI.
- File uploads support up to **100MB** per file.
- The app uses **Spring Boot Docker Compose** integration — it auto-starts the PostgreSQL container if Docker is running.
---
<p align="center">
  Built with ❤️ using Spring Boot, React & Ollama AI
</p>