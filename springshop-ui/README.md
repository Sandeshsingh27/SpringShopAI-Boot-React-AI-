# 🎨 SpringShop AI — Frontend UI

## 📘 Overview

The **SpringShop AI Frontend** is a React 18 single-page application built with **Vite** that provides the user interface for the SpringShop AI e-commerce platform. It features product browsing, a shopping cart, order management, AI-powered product creation, and an **AI chatbot** with real-time SSE streaming.

---

## 📑 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Pages & Routes](#pages--routes)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Configuration](#configuration)

---

## 🔧 Features

| Feature | Description |
|---|---|
| 🏠 **Product Listing** | Homepage with hero banner, product cards, and category filtering |
| 📦 **Product Details** | Full product page with image, description, price, stock status, and add-to-cart |
| ➕ **Add Product** | Form to add products manually or generate them with AI (name, description, image) |
| ✏️ **Update Product** | Edit existing product details and images |
| 🔍 **Product Search** | Keyword-based search with results page |
| 🏷️ **Category Filtering** | Filter products by category from the navbar dropdown |
| 🛒 **Shopping Cart** | Add/remove items, adjust quantities, persistent via `localStorage` |
| 💳 **Checkout** | Modal popup for entering customer details and placing orders |
| 📋 **Order History** | View all placed orders with expandable item details |
| 🤖 **AI Chatbot** | Chat interface with SSE streaming, conversation memory, and RAG-powered responses |
| 🎨 **Modern UI** | Gradient theme, animations, hover effects, stock badges, responsive design |
| 🔔 **Toast Notifications** | User feedback via React Toastify |

---

## 💡 Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | UI library (functional components + hooks) |
| **Vite 5** | Build tool & dev server (with SWC for Fast Refresh) |
| **React Router DOM 6** | Client-side routing |
| **Axios** | HTTP client for backend API calls |
| **Bootstrap 5 + React Bootstrap** | Responsive layout & UI components |
| **Bootstrap Icons** | Iconography |
| **@chatscope/chat-ui-kit-react** | Chat UI components for the AI chatbot |
| **React Toastify** | Toast notifications |
| **React Icons** | Additional icon library |
| **Sass** | CSS preprocessing (dev dependency) |
| **ESLint** | Code linting |

---

## 🗺️ Pages & Routes

| Route | Component | Description |
|---|---|---|
| `/` | `Home` | Product listing with hero banner & category filter |
| `/product/:id` | `Product` | Individual product detail page |
| `/add_product` | `AddProduct` | Add new product (with AI generation support) |
| `/product/update/:id` | `UpdateProduct` | Edit an existing product |
| `/cart` | `Cart` | Shopping cart with checkout |
| `/orders` | `Order` | Order history page |
| `/askai` | `AskAI` | AI chatbot interface (SSE streaming) |
| `/search-results` | `SearchResults` | Product search results |

---

## 🛠 Getting Started

### Prerequisites
- **Node.js 18+** and **npm** (or use the Python `nodeenv` setup described in the root README)

### 1. Install Dependencies
```bash
cd springshop-ui
npm install
```

### 2. Start the Dev Server
```bash
npm run dev
```

Open **http://localhost:5173** 🎉

> ⚠️ Make sure the Spring Boot backend is already running on port `8080` before using the UI.

### Available Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `npm run dev` | Start Vite dev server with HMR |
| `build` | `npm run build` | Production build to `dist/` |
| `preview` | `npm run preview` | Preview the production build locally |
| `lint` | `npm run lint` | Run ESLint on all JS/JSX files |

---

## 📂 Project Structure

```
springshop-ui/
├── index.html                      # HTML entry point
├── package.json                    # Dependencies & scripts
├── vite.config.js                  # Vite config (React SWC plugin)
├── public/
│   └── vite.svg                    # Public static assets
└── src/
    ├── main.jsx                    # App entry point (ReactDOM render)
    ├── App.jsx                     # Root component (Router + Layout)
    ├── axios.jsx                   # Axios instance & API base URL config
    ├── index.css                   # Global CSS
    ├── assets/
    │   ├── react.svg               # React logo
    │   └── unplugged.png           # Placeholder image
    ├── components/
    │   ├── Home.jsx                # Product listing with hero banner
    │   ├── Navbar.jsx              # Gradient navbar (search, cart badge, categories)
    │   ├── Product.jsx             # Product detail page
    │   ├── AddProduct.jsx          # Add product form (manual + AI generation)
    │   ├── UpdateProduct.jsx       # Update product form
    │   ├── Cart.jsx                # Shopping cart
    │   ├── CheckoutPopup.jsx       # Checkout modal (customer details + order)
    │   ├── Order.jsx               # Order history & management
    │   ├── AskAI.jsx               # AI Chatbot (SSE streaming via @chatscope)
    │   ├── SearchResults.jsx       # Product search results
    │   └── Footer.jsx              # Site footer
    ├── Context/
    │   └── Context.jsx             # React Context (global state + cart via localStorage)
    └── styles/
        └── custom.css              # Custom design system (gradients, animations, themes)
```

---

## ⚙️ Configuration

### API Base URL
The frontend communicates with the backend at `http://localhost:8080` by default. The base URL is configured in `src/axios.jsx`. You can also use an environment variable:

Create a `.env` file in `springshop-ui/`:
```env
VITE_BASE_URL=http://localhost:8080
```

### Vite Config
The project uses `@vitejs/plugin-react-swc` for fast React compilation via SWC. Configuration is in `vite.config.js`.

---
