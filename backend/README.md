Distributed File Storage and Sharing System
This project is a full-stack application that provides a distributed file storage and sharing solution. It allows users to upload large files, which are then split into smaller chunks, stored, and can be reassembled for download. Files can be easily shared via a secure, auto-generated QR code.

✨ Features
User Authentication: Secure user registration and login using JWT (JSON Web Tokens).

Large File Uploads: A drag-and-drop interface to upload large files efficiently.

File Chunking: The backend automatically splits files into 5 MB chunks for distributed storage.

Secure File Sharing: Generate a time-limited, secure download link and a corresponding QR code for easy sharing.

Health Check Endpoint: A /health endpoint to monitor the service status.

Cross-Origin Resource Sharing (CORS): Configured to allow communication between the frontend and backend.

🚀 Performance Metrics
In a local test environment, the system demonstrated efficient handling of large files:

Upload: A 36 MB file was successfully chunked and uploaded in 6.4 seconds.

Download: The same 36 MB file was reassembled and downloaded in 1.57 seconds.

🛠️ Tech Stack
Backend: NestJS (TypeScript)

Frontend: React (TypeScript)

Database: MongoDB Atlas

Authentication: Passport.js with JWT Strategy

File Handling: Multer for initial uploads, Node.js Streams for chunking.

QR Code Generation: qrcode library

📂 Project Structure
The project is organized as a monorepo with separate directories for the backend and frontend.

distributed-file-system/
├── backend/                  # NestJS Application
│   ├── src/
│   ├── .env
│   └── package.json
└── frontend/                 # React Application
    ├── src/
    ├── .env.local
    └── package.json

⚙️ Setup and Installation
Prerequisites
Node.js (v18 or later)

npm

A MongoDB Atlas account and a connection string

1. Backend Setup
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create a .env file in the backend root and add your variables
# See .env.example for required fields
cp .env.example .env

MONGO_URI=
JWT_SECRET=THIS_IS_A_VERY_SECRET_KEY
PORT=3001

# Start the development server
npm run start:dev

The backend will be running on http://localhost:3001.

2. Frontend Setup
# Navigate to the frontend directory from the root
cd frontend

# Install dependencies
npm install

# Create a .env.local file in the frontend root
# Update REACT_APP_API_BASE_URL to point to your backend
cp .env.local.example .env.local

REACT_APP_API_BASE_URL=http://192.168.29.105:3001

# Start the development server
npm start

The frontend will be running on http://localhost:3000.

📡 API Endpoints
Method

Endpoint

Protection

Description

POST

/auth/register

Public

Registers a new user.

POST

/auth/login

Public

Authenticates a user and returns a JWT.

POST

/files/upload

JWT Guard

Uploads a file, splits it into chunks, and stores metadata.

GET

/files/download/:fileId

Public

Reassembles and streams a file for download.

GET

/files/download-by-token

JWT

Downloads a file using a short-lived token from a share link.

GET

/files/share/:fileId

JWT Guard

Generates a QR code for a shareable download link.

GET

/health

Public

Checks the health status of the application.

Usage
Navigate to http://localhost:3000 or IPV4 address in your browser.

Create an account and log in.

On the main page, drag and drop a file to upload it.

Once the upload is complete, a QR code will be displayed.

Scan the QR code with another device (e.g., a phone on the same Wi-Fi network) to download the file.

This project was created on September 14, 2025.
