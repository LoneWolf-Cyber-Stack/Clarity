# Clarity

[cloudflarebutton]

A minimalist digital journal for capturing thoughts, quotes, and insights with a focus on a serene reading and writing experience.

Clarity is a minimalist, clean, and visually stunning digital journal application designed for a serene and distraction-free writing experience. It allows users to capture their thoughts, quotes, or insights from books they are reading. The core philosophy is 'less is more', focusing on beautiful typography, generous white space, and an intuitive user interface. The application features a two-pane layout: a sidebar for navigating between journal entries and a main content area for reading and writing. All interactions are designed to be smooth and subtle, using gentle animations to enhance the user experience without causing distraction. The application is built on Cloudflare's edge network for exceptional performance and reliability.

## ✨ Key Features

*   **Minimalist Two-Pane UI**: A distraction-free interface with a sidebar for entries and a main content area for writing and reading.
*   **Full CRUD Functionality**: Create, read, update, and delete journal entries seamlessly.
*   **Beautiful Typography**: Elegant headings with 'Cal Sans' and clear, readable body text with 'Inter'.
*   **Responsive Design**: A flawless experience across all device sizes, from mobile to desktop.
*   **State Management**: Uses Zustand for efficient and predictable frontend state management.
*   **Edge-First Architecture**: Built on Cloudflare Workers and Durable Objects for global low-latency and high reliability.
*   **Subtle Interactions**: Smooth animations and hover states that enhance the user experience without being intrusive.

## 🛠️ Technology Stack

*   **Frontend**: React, TypeScript, Vite, Tailwind CSS
*   **UI Components**: shadcn/ui, Lucide React, Framer Motion
*   **State Management**: Zustand
*   **Backend**: Hono on Cloudflare Workers
*   **Persistence**: Cloudflare Durable Objects
*   **Utilities**: date-fns, Zod

## 🚀 Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

*   [Bun](https://bun.sh/) installed on your machine.
*   A [Cloudflare account](https://dash.cloudflare.com/sign-up).
*   [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed and authenticated.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/clarity_journal.git
    cd clarity_journal
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

### Running Locally

To start the development server for both the frontend and the worker, run:

```bash
bun dev
```

This will start the Vite development server for the React application and a local Wrangler server for the Hono backend, accessible at `http://localhost:3000`.

## 🔧 Development

The project is organized into three main directories:

*   `src/`: Contains the React frontend application code.
*   `worker/`: Contains the Hono backend code running on Cloudflare Workers.
*   `shared/`: Contains TypeScript types shared between the frontend and backend.

### Adding API Endpoints

1.  Define new entities in `worker/entities.ts`.
2.  Add new API routes in `worker/user-routes.ts` using the Hono framework.
3.  Update shared types in `shared/types.ts` if necessary.
4.  Consume the new endpoints from the frontend using the `src/lib/api-client.ts` helper.

## ☁️ Deployment

This application is designed to be deployed to the Cloudflare global network.

1.  **Build the application:**
    ```bash
    bun build
    ```

2.  **Deploy to Cloudflare:**
    ```bash
    bun deploy
    ```

This command will build the frontend assets, bundle the worker, and deploy the entire application using Wrangler.

Alternatively, deploy directly from your GitHub repository:

[cloudflarebutton]

## 📄 License

This project is licensed under the MIT License.