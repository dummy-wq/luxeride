# LuxeRide

A modern, full-stack premium car rental application built with Next.js and MongoDB. 

## 🚀 The Absolute Simplest Way to Run (No Setup Required)

The easiest way to get the app running—with **zero configuration**, no `.env` files, and no framework installation required—is using Docker.

**Prerequisites:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

1. Open your terminal in this project folder.
2. Run this single command:
   ```bash
   docker compose up --build
   ```
3. Wait for the build to finish, then go to **`http://localhost:3000`** in your browser.

*Note: This automatically provisions a local MongoDB database and sets up default environment variables for you! You don't need to do anything else.*

## 🌩️ Connecting to MongoDB Atlas (Optional)

If you'd like to use a live cloud database (like MongoDB Atlas) instead of the temporary local Docker database:

1. Create a file named `.env` in the root directory.
2. Add your Atlas connection string:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/luxeride
   ```
3. Run `docker compose up --build`. The app will automatically connect to your Atlas Cloud database instead!

## 💻 Manual Setup (For Development)

If you want to run the app manually to edit code without Docker:

1. Run `npm install` to install dependencies.
2. Rename `.env.example` to `.env.local` and add your `MONGODB_URI`.
3. Run `npm run dev` to start the development server.

Visit `http://localhost:3000` to see the site.
