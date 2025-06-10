# Transcendence Project (ft_transcendence)

This repository contains the source code for the `ft_transcendence` project, a 42 school assignment. The primary goal is to create a full-stack, single-page web application for a real-time multiplayer Pong contest, complete with user management, chat, and other modern web features.

The project is containerized using Docker for consistent and easy deployment.

## Table of Contents
* [Key Features](#key-features)
* [Tech Stack](#tech-stack)
* [Project Structure](#project-structure)
* [Getting Started](#getting-started)
* [Security Considerations](#security-considerations)
* [Implemented Modules](#implemented-modules)

## Key Features

This application includes the mandatory functionalities specified in the project subject, along with several additional modules to enhance user experience and technical scope.

* **User Management & Authentication**:
  * Secure user registration and login system.
  * Standard user profiles with customizable avatars and display names.
  * Friend system to add other users and see their online status.
  * Detailed match history and player statistics (wins/losses) on user profiles.
* **Gameplay**:
  * Live, real-time multiplayer Pong games against other users remotely.
  * A tournament system that organizes matches and displays the bracket.
  * A matchmaking system to pair participants for tournament games.
* **Social**:
  * Functionality to invite users to a game.

## Tech Stack

The project is built using a modern technology stack, adhering to the constraints and options provided in the project modules.

* **Backend**:
  * **Framework**: Fastify
  * **Language**: TypeScript
  * **Real-time Communication**: Socket.IO for live gameplay.
  * **Authentication**: JSON Web Tokens (JWT) for securing API routes.
* **Frontend**:
  * **Framework/Library**: A custom setup using TypeScript.
  * **Language**: TypeScript
  * **Styling**: Tailwind CSS
  * **Real-time Communication**: Socket.IO Client
* **Database**:
  * **Type**: SQLite
* **DevOps**:
  * **Containerization**: Docker & Docker Compose
  * **Reverse Proxy**: Nginx

## Final Project Structure (didn’t complete yet)

The repository is organized into distinct services, managed by Docker Compose.

```
/
├── backend/            # NestJS backend service
├── frontend/           # The main user interface
├── docker-compose.yml  # Docker service definitions
└── .env.example        # Environment variable template
```

## Getting Started

To get a local copy up and running, please follow these steps.

### Prerequisites
* Docker installed and running on your machine.
* Docker Compose installed.

### Installation

1. **Clone the Repository**
   ```sh
   git clone [https://github.com/BatuhanKas/transcendence.git](https://github.com/BatuhanKas/transcendence.git)
   cd transcendence
   ```

2. **Set Up Environment Variables**
   Create a `.env` file in the root directory by copying the example file.
   ```sh
   cp .env.example .env
   ```
   Fill in the required values in the `.env` file, such as `JWT_SECRET`, database credentials, and any API keys for third-party services.

3. **Build and Run with Docker**
   Launch all services using Docker Compose. The `--build` flag will build the images from the Dockerfiles if they don't exist.
   ```sh
   docker-compose up --build
   ```

4. **Access the Application**
   Once the containers are running, you can access the application in your browser:
   * **Website**: `http://localhost:8080` (or the port specified in your Docker/env setup)

## Security Considerations

Security was a primary concern during development. The following measures have been implemented:

* **Password Hashing**: All user passwords stored in the database are securely hashed.
* **Input Validation**: User inputs and forms are validated on the server-side to protect against malicious data.
* **Protection Against Common Vulnerabilities**: The use of an ORM and framework-level tools helps protect against SQL injection attacks.
* **Secure Credential Storage**: All sensitive credentials, API keys, and environment variables are stored in a `.env` file and are not committed to the repository.
* **API Protection**: API routes are protected, requiring a valid JWT for access to sensitive resources.

## Implemented Modules

This project successfully completes the mandatory part and the following selection of major and minor modules as defined by the project subject:

* **Web Modules**:
  * **Major Module**: Backend developed using a framework (Node.js with Fastify).
  * **Minor Module**: Frontend built with a toolkit (TypeScript with Tailwind CSS).
  * **Minor Module**: A database is used for the backend (SQLite).
* **User Management Modules**:
  * **Major Module**: Standard user management, authentication, and persistent profiles across tournaments.
* **Gameplay and User Experience Modules**:
  * **Major Module**: Remote players can play against each other over the network.
