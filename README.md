## Table of Contents

- [MyChat](#mychat)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Technologies Used](#technologies-used)
  - [Project Structure](#project-structure)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Running the Application](#running-the-application)
    - [Running Tests](#running-tests)
    - [Building for Production](#building-for-production)
    - [Code Formatting and Linting](#code-formatting-and-linting)
  - [Deployment](#deployment)
  - [License](#license)

## Features

- **Create Chats:** Organize your ideas into distinct chat threads.
- **Send Messages:** Jot down short messages/ideas within your chats.
- **Edit Messages:** Refine your thoughts by editing existing messages.
- **Delete Messages:** Remove messages that are no longer needed.
- **Star Messages:** Highlight important ideas for quick access.
- **View Starred Messages:** Easily review all starred messages within a specific chat.
- **Export Chats:** Back up your chats or share them.
- **Import Chats:** Restore chats or bring in new ones.

## Technologies Used

- **Frontend:**
  - [React 19](https://react.dev/) - A JavaScript library for building user interfaces.
  - [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for rapidly building custom designs.
  - [TypeScript](https://www.typescriptlang.org/) - A superset of JavaScript that adds static types.
  - [Local Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) - For client-side data persistence.
  - [Vite](https://vitejs.dev/) - Next generation frontend tooling.
  - [React Icons](https://react-icons.github.io/react-icons/) - Popular icons for React applications.
  - [React Textarea Autosize](https://github.com/AndrejJurkin/react-textarea-autosize) - For auto-resizing text areas.
  - [Vite Plugin PWA](https://vite-plugin-pwa.netlify.app/) - For PWA capabilities.
- **Development Tools:**
  - [ESLint](https://eslint.org/) - Pluggable linter for identifying and reporting on patterns in JavaScript code.
  - [Prettier](https://prettier.io/) - An opinionated code formatter.
  - [Vitest](https://vitest.dev/) - A blazing fast unit-test framework powered by Vite.
  - [jsdom](https://github.com/jsdom/jsdom) - A JavaScript implementation of the DOM and HTML standards.
  - [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) - Simple and complete React UI testing utilities.

## Project Structure

The project follows a component-driven architecture with a clear separation of concerns:

```
src/
├── components/           # Reusable UI components
│   ├── atoms/            # Small, stateless components (e.g., buttons, inputs)
│   ├── molecules/        # Groups of atoms forming simple, reusable components (e.g., prompt)
│   └── organisms/        # Complex components made of molecules and atoms (e.g., chat)
├── context/              # React Context providers for global state management
├── hooks/                # Custom React hooks for reusable logic
├── storage/              # Modules for interacting with local storage
├── utils/                # Utility functions
├── AppContent.tsx        # Main application logic
├── app.tsx               # Root component of the application
├── main.tsx              # Entry point for React rendering
├── index.css             # Global styles
└── types.ts              # Global TypeScript type definitions
```

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have [Node.js](https://nodejs.org/en/) (which includes npm) installed on your machine.
It is recommended to use `npm` for package management.

### Installation

1.  **Clone the repository:**

    ```bash
    git clone git@github.com:jairo-cereceda/MyChat.git
    cd MyChat
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

### Running the Application

To start the development server:

```bash
npm run dev
```

This will typically open the application in your browser at `http://localhost:5173/`.

### Running Tests

To execute the unit tests with Vitest:

```bash
npm test
```

### Building for Production

To build the application for production:

```bash
npm run build
```

This command compiles TypeScript and bundles the assets into the `dist/` directory.

### Code Formatting and Linting

- **Linting:** To check for code quality and potential errors:

  ```bash
  npm run lint
  ```

- **Formatting:** To automatically format your code with Prettier:

  ```bash
  npm run format
  ```

## Deployment

This project uses `gh-pages` for deployment to GitHub Pages.

- **Prepare for deployment:**

  ```bash
  npm run predeploy
  ```

- **Deploy to GitHub Pages:**

  ```bash
  npm run deploy
  ```

---

```

```
