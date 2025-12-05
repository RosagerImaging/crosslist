# **Project Build Prompt: AI-Powered Reseller Hub "Crosslist"**

## **Your Role**

You are an expert-level AI Software Engineer. Your task is to build a fully functional, production-ready prototype of a web application called "Crosslist" based on the detailed specifications below. You will be responsible for the entire development lifecycle, from architecture and technology selection to implementation, testing, and deployment preparation.

## **1. Project Vision & Core Objective**

The goal is to create "Crosslist," an AI-native, web-based inventory management system for e-commerce resellers. The system will feature a central "hub" for managing inventory, analytics, and marketplace integrations. This hub will control a suite of autonomous AI agent systems, each designed to automate a specific part of the reselling workflow (e.g., listing, optimizing, promoting, sourcing).

---

## **2. Architectural Blueprint & Technology Stack**

To ensure a robust, scalable, and maintainable application, we will use the following architecture and technology stack.

### **Overall Architecture**

We will build a monorepo using Turborepo to manage three core packages:

1.  **`apps/web`**: A Next.js application for the user-facing central hub.
2.  **`apps/server`**: A Python-based backend running FastAPI to handle business logic, API requests, and orchestrate the AI agents.
3.  **`packages/browser-extension`**: A Chrome Browser Extension to perform in-browser automation on marketplace websites.

### **Technology Stack**

- **Monorepo Manager**: Turborepo (as the project is already set up with it).
- **Frontend (`apps/web`)**:
  - Framework: Next.js (with App Router)
  - Language: TypeScript
  - Styling: Tailwind CSS for utility-first styling.
  - UI Components: shadcn/ui for a set of high-quality, accessible components.
  - Authentication: NextAuth.js for secure user login and session management.
  - Data Fetching/State: React Query (TanStack Query) for managing server state.
- **Backend (`apps/server`)**:
  - Framework: FastAPI (Python) for creating a high-performance REST API.
  - Language: Python
  - **AI Agent Framework**: **LangChain** or **AutoGen**. These frameworks provide robust abstractions for creating, composing, and managing AI agents, tools, and chains. This is the recommended approach for building the synergistic agentic systems.
  - Database ORM: SQLAlchemy or Pydantic for data modeling and validation.
  - Image Processing: `Pillow`, `rembg` (for background removal).
  - Web Scraping/Automation: `BeautifulSoup`, `Selenium` (for tasks not handled by the extension).
- **Browser Extension (`packages/browser-extension`)**:
  - Framework: None (Plain JavaScript/TypeScript).
  - Bundler: Webpack or Vite to compile the extension assets.
  - Functionality: Content scripts for DOM manipulation on marketplace sites and a background script for communication with the FastAPI backend.
- **Database**:
  - PostgreSQL: A powerful, open-source relational database.
  - Prisma: (Optional, for the Next.js app) Can be used for type-safe database access if preferred over a full-backend ORM approach for simpler queries.

---

## **3. Phased Implementation Plan**

Follow this phased approach to build the application.

### **Phase 1: Project Scaffolding & Setup**

1.  **Verify Monorepo**: Ensure the Turborepo structure is correctly set up with placeholders for `apps/web`, `apps/server`, and `packages/browser-extension`.
2.  **Scaffold `apps/web`**: Create a new Next.js application in the `apps/web` directory. Install and configure TypeScript, Tailwind CSS, and shadcn/ui. Set up NextAuth.js with a basic email/password provider.
3.  **Scaffold `apps/server`**: Set up a new Python project in `apps/server`. Initialize a `virtualenv`, create a `requirements.txt` file, and add `fastapi`, `uvicorn`, `langchain`, and other necessary Python libraries. Create a basic "hello world" endpoint.
4.  **Scaffold `packages/browser-extension`**: Create the necessary files for a basic Chrome Extension: `manifest.json`, a background script, and a content script.

### **Phase 2: Database & Core Models**

1.  **Design Schema**: Design the PostgreSQL database schema. Key tables should include:
    - `users` (id, email, password_hash, etc.)
    - `marketplaces` (id, name, api_url, etc.)
    - `user_marketplaces` (linking users to marketplaces with encrypted credentials)
    - `products` (user_id, title, description, sku, etc.)
    - `listings` (product_id, marketplace_id, url, price, status, etc.)
    - `analytics_data` (for tracking sales, trends, etc.)
2.  **Implement Models**: Create the corresponding data models in the Python backend using Pydantic or SQLAlchemy.

### **Phase 3: Feature Development - Central Hub (`apps/web`)**

1.  **Authentication**: Implement the full login, registration, and logout flow.
2.  **Dashboard UI**:
    - Create a main dashboard page to display an overview of inventory.
    - Implement a table view for all products/listings with sorting and filtering.
    - Use placeholder data until the backend API is ready.
3.  **Marketplace Integration UI**:
    - Create a settings page where users can add, view, and remove marketplace connections.
    - Build a secure form to input and encrypt marketplace credentials, which will be sent to the FastAPI backend.
4.  **Agent Settings UI**:
    - For each agentic system (Promotion, Liquidation, etc.), create a settings page with UI controls (toggles, sliders, text inputs) to configure its behavior. For example, the "Liquidation" agent settings should allow users to define discount percentages and timelines.

### **Phase 4: Feature Development - Backend & Agents (`apps/server`)**

This is the core AI implementation phase. Use LangChain to define agents, tools, and chains.

1.  **API Endpoints**: Create FastAPI endpoints for all frontend needs (auth, CRUD for products/listings, agent configuration).
2.  **Crosslisting Agent**:
    - **Tool**: A tool that takes a source marketplace URL, scrapes the listing data (title, description, images, price), and returns a structured object.
    - **Agent**: An agent that uses this tool, maps the scraped data to the field requirements of other connected marketplaces, and uses their respective APIs (or the Chrome extension) to create new listings.
3.  **Listing Optimizer System**:
    - **Photo Agent**: An agent with a tool that accepts an image, uses `rembg` to remove the background, and `Pillow` to adjust contrast/brightness.
    - **Description Agent**: An agent that takes an image or SKU. If an image, use a multimodal model (via LangChain integration) to generate a description. If an SKU, use a language model to generate a description. Use Chrome extension to view manufacturer's product info once product is identified via the SKU or image based search (similar to Google Lens)
    - **Pricing Agent**: An agent that takes a product description, scrapes competing marketplaces for similar items, and suggests a price range based on condition and market data.
4.  **Promotion Agent (Poshmark Bot)**:
    - This agent will primarily orchestrate actions via the Chrome Extension.
    - **Logic**: The agent's logic must be sophisticated. It should not just perform actions but do so with _human-like_ variability. Use randomized delays between actions. The frequency and number of actions (follows, shares, likes) should be based on a profile (e.g., newer accounts are less active than older ones and accounts with fewer listings have less to share/like). This logic resides on the backend, which sends commands to the extension.
5.  **Implement Other Agents**: Build out the remaining agents (Sourcing, Trends, Liquidation, Customer Service) following the same pattern: define the agent's goal, create the necessary tools (for data scraping, API calls, etc.), and write the orchestration logic in Python.

### **Phase 5: Chrome Extension (`packages/browser-extension`)**

1.  **Backend Communication**: Establish a secure communication channel (e.g., using long-lived connections or message passing) between the background script and the FastAPI backend. The extension will receive commands from the backend.
2.  **Content Scripts**: Write content scripts for each target marketplace (Poshmark, eBay, etc.). These scripts will be responsible for programmatically filling out forms, clicking buttons, and scraping data from the page, based on commands received from the background script.
3.  **Authentication Handling**: If a marketplace session expires, the extension should be able to detect this and notify the backend, which can then alert the user via the web app.

---

## **4. Final Deliverables & Success Criteria**

- A complete, running application in a monorepo structure.
- A functional Next.js web app allowing users to register, connect at least one marketplace, and manage a product.
- At least two functional AI agent systems (e.g., "Crosslisting" and the "Listing Optimizer").
- A functional Chrome Extension that can perform at least one automated action on a marketplace (e.g., share an item on Poshmark).
- Clear instructions in a `README.md` file for how to set up and run the entire project stack locally.
