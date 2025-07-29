# ZKP Job Board - Startup Instructions

This document provides instructions for running the ZKP Job Board application with the in-memory database implementation.

## Overview

The ZKP Job Board application consists of two main components:

1. **Python Server**: Serves the frontend files
2. **Node.js Backend**: Handles API requests and manages the in-memory database

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Python (v3.6 or higher)

## Starting the Application

### Step 1: Install Dependencies

First, install the required dependencies for the backend:

```bash
cd backend
npm install
```

### Step 2: Start the Backend Server

Start the Node.js backend server with the in-memory database:

```bash
cd backend
node src/server.js
```

You should see a message indicating that the server is running on port 5050. This is the API server that the frontend will communicate with.

### Step 3: Start the Python Server

In a new terminal window, start the Python server to serve the frontend files:

```bash
python server.py
```

You should see a message indicating that the server is running on port 8001.

### Step 4: Access the Application

Open your web browser and navigate to:

```
http://localhost:8001/src/index.html
```

You should now see the ZKP Job Board application running with the in-memory database.

**Note:** If you navigate to just `http://localhost:8001/`, you will see a directory listing. You need to explicitly navigate to `/src/index.html` to view the application.

## Features

The application now works with an in-memory database instead of MongoDB, while preserving all functionality:

- Listing jobs
- Getting job details
- Creating new jobs
- Updating and deleting jobs
- Searching jobs with filters
- Applying for jobs
- Managing applicant profiles

## In-Memory Database

The in-memory database implementation:

- Preserves the MongoDB models and structure
- Implements mock Mongoose methods (find, findById, save, etc.)
- Initializes with sample data
- Persists data for the duration of the server runtime

This implementation allows the application to run without requiring a MongoDB instance, making it easier to develop and test.

## API Endpoints

The backend server provides the following API endpoints:

### Jobs
- GET /api/jobs - Get all jobs
- GET /api/jobs/:id - Get a specific job
- POST /api/jobs - Create a new job
- PUT /api/jobs/:id - Update a job
- DELETE /api/jobs/:id - Delete a job

### Applicants
- GET /api/applicants - Get all applicants
- GET /api/applicants/:id - Get a specific applicant
- POST /api/applicants - Create a new applicant
- PUT /api/applicants/:id - Update an applicant
- DELETE /api/applicants/:id - Delete an applicant

### Applications
- GET /api/applications - Get all applications
- GET /api/applications/:id - Get a specific application
- POST /api/applications - Create a new application
- PUT /api/applications/:id - Update an application
- DELETE /api/applications/:id - Delete an application

## Notes

- The in-memory database is reset when the server is restarted
- All data is stored in memory and is not persisted to disk
- The application uses Zero-Knowledge Proofs (ZKP) for privacy-preserving background verification