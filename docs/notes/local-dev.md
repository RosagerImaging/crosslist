# Local Development Setup Guide

This guide outlines the steps to get your entire monorepo project running locally, including the Next.js web app, FastAPI backend, and Chrome extension.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js (v18 or higher) and npm:** Used for JavaScript/TypeScript projects and Turborepo.
- **Python (v3.9 or higher) and Poetry:** Used for the FastAPI backend. If Poetry is not installed, follow the instructions at [https://python-poetry.org/docs/#installation](https://python-poetry.org/docs/#installation).

## Initial Setup

First, install all root-level JavaScript/TypeScript dependencies and Python dependencies for the backend.

1.  **Install Root Dependencies:**
    Navigate to the project root and install all JavaScript/TypeScript dependencies:

    ```bash
    npm install
    ```

2.  **Install Python Backend Dependencies:**
    Navigate to the `apps/api` directory and install its dependencies using Poetry:
    ```bash
    cd apps/api
    poetry install
    cd ../.. # Go back to the project root
    ```

## Starting the Development Servers

You can start the frontend and backend development servers concurrently using Turborepo.

1.  **Start All Development Servers:**
    From the project root, run the following command. This will start the Next.js web app and the FastAPI backend.

    ```bash
    npm run dev
    ```

    - The Next.js web app will typically be available at `http://localhost:3000`.
    - The FastAPI backend will typically be available at `http://localhost:8000`.

## Developing the Chrome Extension

The Chrome extension requires a separate build process and needs to be loaded manually into your browser for development.

1.  **Build the Chrome Extension:**
    From the project root, build the extension:

    ```bash
    npm run build:chrome
    ```

    This will create a `dist` folder inside `apps/chrome-extension` and an `extension.zip` file.

2.  **Load the Extension in Chrome:**
    - Open Chrome and navigate to `chrome://extensions`.
    - Enable "Developer mode" using the toggle in the top right corner.
    - Click on "Load unpacked".
    - Navigate to your project directory, then select the `apps/chrome-extension/dist` folder.
    - The extension should now appear in your list of extensions. You can pin it to your toolbar for easy access.

    _Note: Any changes to the extension's source code will require you to re-run `npm run build:chrome` and then click the refresh button on the extension's card in `chrome://extensions`._

## Generating the API Client

If you make changes to your FastAPI backend's API, you'll need to regenerate the TypeScript client for your frontend applications.

1.  **Ensure Backend is Running:**
    Make sure your FastAPI backend is running (e.g., by running `npm run dev` or `npm run dev:api` in a separate terminal).

2.  **Generate the API Client:**
    From the project root, run:
    ```bash
    npm run generate:api-client
    ```
    This will fetch the OpenAPI schema from your running backend and generate a type-safe client in `packages/api-client/src`. Your Next.js app and Chrome extension can then import and use this client.

---

This guide should help you get started with local development. Happy coding!
