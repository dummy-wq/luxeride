# 🚀 Plug & Play Manual

This guide is designed for third-party licensees or buyers to get the platform up and running in minutes. Follow these steps to "plug in" your server and launch your business.

---

## 1. Quick Start (Development)

If you have Node.js installed, you can start the app immediately:

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Start Development Server**:
   ```bash
   npm run dev
   ```
3. **Visit**: [http://localhost:3000](http://localhost:3000)

> [!TIP]
> By default, the app uses a built-in mock mode if no database is detected, allowing you to browse the UI immediately.

---

## 2. Plugging in the Server (Database)

The platform is powered by **MongoDB**. You have two options for your "server":

### Option A: MongoDB Atlas (Recommended for Production)
1. Create a free or paid cluster at [mongodb.com](https://www.mongodb.com/cloud/atlas).
2. Get your **Connection String** (e.g., `mongodb+srv://user:pass@cluster.mongodb.net/dbname`).
3. Create a `.env.local` file in the project root.
4. Add your string:
   ```env
   MONGODB_URI=your_atlas_connection_string_here
   JWT_SECRET=any_random_secure_string
   ```

### Option B: Local Docker Server
If you have Docker installed:
1. Run `docker-compose up -d`.
2. This will automatically spin up a private MongoDB server and the Web app, pre-configured to talk to each other.

---

## 3. Configuration & Secrets

All "plugs" are managed via **Environment Variables**. Copy `.env.example` to `.env.local` and update:

| Variable | Importance | Description |
| :--- | :--- | :--- |
| `MONGODB_URI` | **Required** | The address of your database server. |
| `JWT_SECRET` | **Required** | A secret key to secure user logins. |
| `ADMIN_EMAIL` | Optional | Set this to gain access to the /admin dashboard. |
| `ADMIN_PASSWORD` | Optional | The password for your admin account. |

---

## 4. Branding & White-labeling

Once the server is "plugged in," you will want to change the brand.
- **Visuals**: See [WHITE_LABELING.md](WHITE_LABELING.md) for a step-by-step on changing logos, colors, and names.
- **Fleet**: Edit `lib/data/cars.ts` to add your specific vehicle inventory.

---

## 5. Deployment Guide

### Deploying to Vercel (Easiest)
1. Push this code to a Private GitHub Repository.
2. Connect the repo to [Vercel](https://vercel.com).
3. In the **Environment Variables** section, add your `MONGODB_URI` and `JWT_SECRET`.
4. Click **Deploy**.

### Deploying to a VPS (DigitalOcean/Linode)
1. Install Docker on your server.
2. Clone the repo and run `docker-compose up -d`.
3. Set up an Nginx reverse proxy to port `3000`.

---

## 6. Admin Panel

To manage bookings and users:
1. Go to `/admin`.
2. Login with your `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
3. If not set, it defaults to `admin@luxeride.com` / `admin123` in development mode.

---

**Need help?**
Refer to the `WHITE_LABELING.md` for deep UI customization or check the specific component documentation in `app/components/README.md` (if available).

---

## 7. Backend Architecture

The platform follows a **Serverless-ready** architecture using Next.js API Routes:

- **API Layer**: Located in `app/api/`. These handle authentication, bookings, and payments.
- **Data Layer**: Located in `lib/db/`. Uses the official MongoDB driver with a singleton connection pattern for high performance.
- **Auth**: Stateless JWT authentication. No session management is required on the server, making it horizontally scalable.
- **Validation**: All incoming data is validated using **Zod** schemas (see `lib/schemas/`).
