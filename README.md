# MERN Project: Farm floo

A fullstack MERN project for farmers . Basically it is a type of e-commerce website .

---

## Features

-  user authentication
-  CRUD operations

---

## Folder Structure

root ├── frontend/ # Frontend React application 
     ├── backend/ # Backend Node.js application └── README.md # Project documentation


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
cd frontend
npm install
```

### 3. Environment Variables
```
MONGO_URI= Your_Mongodb_URI
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
MAILTRAP_TOKEN=Your_mailtrap_token
CLIENT_URL=http://localhost:5173/
EMAIL_PASS=sixteen digit password
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


