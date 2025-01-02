# MERN Project: Farm floo

A full-stack MERN application that includes a separate client and server setup. This project demonstrates a structured approach to building robust web applications.

---

## Features

-  user authentication
-  CRUD operations

---

## Folder Structure

root ├── client/ # Frontend React application 
     ├── server/ # Backend Node.js application └── README.md # Project documentation


---

## Prerequisites

Ensure you have the following installed:

- **Node.js** (v16.x or later)
- **npm** or **yarn**
- **MongoDB** (running locally or a cloud-based MongoDB service)

---

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/satyam0827/Farm-flo.git
cd Farm-flo
```

### 2. Install Dependencies

#### backend
```bash
npm install
```

#### Frontend
```bash
cd client
npm install
```

### 3. Environment Variables
```
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
```

### 4. Start the Server
- for frontend go to client directory and then
```bash
npm run dev
```
- for backend go to root directory and then
```bash
nodemon
```


