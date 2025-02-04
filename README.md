# Graph Flow: A Friendly Node Graph Editor

Welcome to **Graph Flow**, an interactive and visually appealing editor for creating and customizing node-based diagrams. Think of it as your creative playground for building flows, pipelines, or any node-driven system—all powered by React, Redux Toolkit, and TypeScript.

## What’s this project all about?

Graph Flow gives you a user-friendly interface to **create, connect, and manage nodes** in a dynamic graph environment. Whether you’re building a simple diagram or a complex flow, our features are designed to keep things straightforward and, above all, fun.

### Key Highlights
- **Node Management**: Create new nodes, drag them around, drop them into place, and even link them together to form complex flows.  
- **Node Customization**: Pick your favorite colors, tweak font sizes (12px–24px), and watch changes in real time.  
- **History Management**: One wrong move? No problem. With global and node-specific undo/redo, you can easily step backward or forward. Your work also auto-saves, so you can pick up right where you left off.  
- **Error Handling**: If something unexpected happens, you’ll see a friendly error message and can quickly recover without losing your progress.  
- **Modern UI/UX**: Enjoy a responsive design, a slick dark theme, and intuitive controls that update in real time.

## Project Structure : 

### Core Tech Stack
- **React 18+** (TypeScript): Builds the interactive UI.  
- **Redux Toolkit**: Simplifies state management.  
- **React Redux**: Connects Redux’s global state to our React components.  

### Key Packages
- **`reactflow`**: Powers the node-based graph and offers interactive diagramming.  
- **`react-color`**: Lets you easily pick and apply colors to nodes.  
- **`@reduxjs/toolkit`**: Helps manage state changes with minimal boilerplate.

## Getting Started

Here’s how you can run Graph Flow locally:

1. **Clone the repository**:  
   ```bash
   git clone [repository-url]
   ```
2. **Navigate to the project**:  
   ```bash
   cd graph-flow
   ```
3. **Install dependencies**:  
   ```bash
   npm install
   ```
4. **Start the dev server**:  
   ```bash
   npm run dev
   ```
5. **Open the app**: Once the server is running, head to `http://localhost:5173` in your browser.

## How I Organize Things

### State Management
I use **Redux Toolkit** to split my logic into separate “slices”—one each for the graph, history, and node styling. TypeScript keeps my codebase type-safe and makes debugging easier.

### Components & Architecture
- I rely on **functional components** and React hooks for clarity and simplicity.  
- **Memoization** helps me avoid unnecessary re-renders.  
- Each component focuses on a specific feature, making it simpler to read, maintain, and extend.

### Performance & Error Handling
- I keep performance snappy through **optimized state updates** and **memoization**.  
- A **global error boundary** ensures graceful error recovery and user-friendly messages.


---

Enjoy exploring and building with Graph Flow! If you have any questions, ideas, or just want to say hi, don’t hesitate to reach out me at [@preetamf](https://www.linkedin.com/in/preetamf).