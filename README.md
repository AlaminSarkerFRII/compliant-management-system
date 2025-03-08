# User Role-Based Complaint Management System

## Overview
This system is a Support Ticketing System where customers can submit complaints, and admins can manage tickets. It includes authentication, role-based access control, ticket creation, replies, and ticket status management.

## Tech Stack
- **Backend**: Node.js, Express.js, Prisma ORM, MySQL
- **Frontend**: React.js (Planned for Future Implementation)
- **Authentication**: JWT (JSON Web Token)
- **Deployment**: DigitalOcean (or any cloud provider)

## Setup Guide

### Prerequisites
- Node.js (v18+ recommended)
- MySQL Database
- Prisma ORM

### Installation Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/AlaminSarkerFRII/compliant-management-system.git
   cd compliant-management-system
   ```
2. Install dependencies:
   ```sh
   yarn
   ```
3. Configure environment variables:
   Create a `.env` file in the root directory and add the following:
   ```env
   DATABASE_URL="mysql://username:password@localhost:3306/your_database"
   JWT_SECRET="your_jwt_secret"
   ```
4. Run database migrations:
   ```sh
   npx prisma migrate dev --name init
   ```
5. Start the server:
   ```sh
   node server.js
   ```

## API Documentation

### Authentication
#### 1️⃣ **User Registration**
- **Endpoint**: `POST /api/auth/signup`
- **Description**: Registers a new user (Customer or Admin)
- **Request Body**:
  ```json
  {
    "name": "Alamin Sarker",
    "email": "alamin@example.com",
    "password": "securepassword",
    "role": "ADMIN"
  }
  ```
- **Response**:
  ```json
  {
    "message": "User registered successfully",
    "user": {
      "id": 1,
      "name": "Alamin Sarker"
    }
  }
  ```

#### 2️⃣ **User Login**
- **Endpoint**: `POST /api/auth/login`
- **Description**: Logs in a user and provides a JWT token
- **Request Body**:
  ```json
  {
    "email": "alamin@example.com",
    "password": "securepassword"
  }
  ```
- **Response**:
  ```json
  {
    "token": "jwt-token"
  }
  ```

### Ticket Management
#### 3️⃣ **Create a Ticket** (Customer Only)
- **Endpoint**: `POST /api/tickets/create`
- **Requires**: Authentication (Customer)
- **Request Body**:
  ```json
  {
    "subject": "Login Issue",
    "description": "I cannot log into my account."
  }
  ```
- **Response**:
  ```json
  {
    "message": "Ticket created successfully",
    "ticket": {
      "id": 1,
      "subject": "Login Issue",
      "status": "OPEN"
    }
  }
  ```

#### 4️⃣ **Get My Tickets** (Customer Only)
- **Endpoint**: `GET /api/tickets/my-tickets`
- **Requires**: Authentication (Customer)

#### 5️⃣ **Get All Tickets** (Admin Only)
- **Endpoint**: `GET /api/tickets`
- **Requires**: Authentication (Admin)

#### 6️⃣ **Update Ticket Status** (Admin Only)
- **Endpoint**: `PATCH /api/tickets/:id/status`
- **Requires**: Authentication (Admin)
- **Request Body**:
  ```json
  {
    "status": "RESOLVED"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Ticket status updated successfully"
  }
  ```

### Reply System
#### 7️⃣ **Add a Reply to a Ticket**
- **Endpoint**: `POST /api/tickets/:id/reply`
- **Requires**: Authentication (Customer/Admin)
- **Request Body**:
  ```json
  {
    "message": "We are working on this issue."
  }
  ```
- **Response**:
  ```json
  {
    "message": "Reply added successfully"
  }
  ```

### Security Enhancements
- **Authentication**: JWT-based authentication
- **Role-Based Access Control (RBAC)**: Ensures only authorized users can perform actions

## Future Plans
✅ **Implement Frontend using React.js**
✅ **Add an Admin Dashboard for Ticket Management**
✅ **Enhance UI/UX for better user experience**
✅ **Improve API Security & Error Handling**
---
For any queries, contact [AlaminSarker] at [alamin.sarker4241@gmail.com]

