# Collaborative Web IDE

A web-based collaborative Integrated Development Environment (IDE) with real-time updates, terminal interaction, and a file system. The backend is powered by Express.js and WebSockets, while the frontend is built using Vite and React.

## Features

- **Real-time collaboration** using WebSockets
- **Integrated terminal** for command execution
- **File system support** for managing project files
- **Syntax highlighting and editor features**
- **Multi-user support** for simultaneous editing
- **Fast and modern frontend** using Vite + React

## Technologies Used

### Frontend
- React (with Vite)
- WebSockets (for real-time communication)
- Tailwind CSS / Styled Components (for UI styling)

### Backend
- Node.js with Express.js
- WebSockets (Socket.io or ws library)
- File system interaction (fs module)
- Docker (for containerized execution)

## Installation

### Prerequisites
Ensure you have the following installed:
- Node.js (v16 or later)
- npm / yarn
- Docker

### Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/collaborative-web-ide.git
   cd collaborative-web-ide
   ```

2. Install dependencies:
   ```sh
   # Install backend dependencies
   cd server && npm install
   ```
   ```sh
   # Install frontend dependencies
   cd ../client && npm install
   ```

3. Start the backend server:
   ```sh
   cd ../server
   npm run dev
   ```

4. Start the frontend:
   ```sh
   cd ../client
   npm run dev
   ```

5. Open the browser and navigate to:
   ```
   http://localhost:5173
   ```

## Usage

- Users can create and edit files in real time.
- The terminal allows running commands and interacting with the environment.
- Multiple users can collaborate on a project simultaneously.
- Changes are synced instantly using WebSockets.
