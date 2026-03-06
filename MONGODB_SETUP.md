# MongoDB Setup Guide for LuxeRide

This guide will help you set up MongoDB for the LuxeRide car rental application.

## Prerequisites

- MongoDB Atlas account (free tier available at https://www.mongodb.com/cloud/atlas)
- Node.js 16+ installed
- NPM or Yarn package manager

## Step 1: Create MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in to your account
3. Create a new project (or use existing)
4. Click "Create" to build a new cluster
5. Choose the free tier (M0)
6. Select your preferred region
7. Create the cluster (takes ~3-5 minutes)

## Step 2: Set Up Database User & Connection String

1. In the cluster view, go to "Database Access" (left sidebar)
2. Click "Add New Database User"
3. Create a username and password (save these!)
4. Click "Create User"

5. Go to "Network Access" (left sidebar)
6. Click "Add IP Address"
7. Choose "Allow Access from Anywhere" (for development) or add your IP
8. Click "Confirm"

## Step 3: Get Connection String

1. Click "Connect" on your cluster
2. Choose "Drivers"
3. Select "Node.js" and version "5.x"
4. Copy the connection string
5. Replace `<username>` and `<password>` with your credentials
6. Replace `myFirstDatabase` with `luxeride`

Example:
```
mongodb+srv://username:password@cluster.mongodb.net/luxeride?retryWrites=true&w=majority
```

## Step 4: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Edit `.env.local` and add your configuration:
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/luxeride?retryWrites=true&w=majority
MONGODB_DB=luxeride
JWT_SECRET=your-super-secret-key-change-this-in-production
NODE_ENV=development
```

## Step 5: Install Dependencies

```bash
npm install
# or
yarn install
```

## Step 6: Create Database Indexes (Optional but Recommended)

The application will automatically create collections on first use. However, you can create indexes in MongoDB Atlas:

1. Go to "Collections" in your cluster
2. Create a new database called `luxeride`
3. Create these collections:
   - `users` - with a unique index on `email`
   - `bookings` - with an index on `userId`
   - `payments` - with an index on `userId` and `bookingId`

## Step 7: Run the Application

```bash
npm run dev
```

The application will start at `http://localhost:3000`

## Database Schema

### Users Collection
```json
{
  "_id": ObjectId,
  "fullName": "string",
  "email": "string (unique)",
  "passwordHash": "string",
  "phone": "string",
  "address": "string",
  "city": "string",
  "licenseNumber": "string",
  "createdAt": Date,
  "updatedAt": Date,
  "isActive": boolean
}
```

### Bookings Collection
```json
{
  "_id": ObjectId,
  "userId": ObjectId,
  "carId": number,
  "carName": "string",
  "carPrice": number,
  "startDate": Date,
  "endDate": Date,
  "pickupLocation": "string",
  "dropoffLocation": "string",
  "numberOfDays": number,
  "totalCost": number,
  "status": "pending|confirmed|completed|cancelled",
  "qrCode": "string",
  "notes": "string",
  "createdAt": Date,
  "updatedAt": Date
}
```

### Payments Collection
```json
{
  "_id": ObjectId,
  "userId": ObjectId,
  "bookingId": ObjectId,
  "amount": number,
  "currency": "string",
  "paymentMethod": "card|wallet|upi|cash",
  "status": "pending|completed|failed|refunded",
  "transactionId": "string",
  "notes": "string",
  "createdAt": Date,
  "updatedAt": Date
}
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile

### Bookings
- `GET /api/bookings` - Get user's bookings
- `POST /api/bookings` - Create new booking

### Payments
- `GET /api/payments` - Get user's payments
- `POST /api/payments` - Create new payment

## Security Notes

1. **Change JWT_SECRET**: Update the JWT secret in production
2. **MongoDB Credentials**: Never commit `.env.local` to version control
3. **Password Hashing**: Passwords are hashed with bcryptjs before storage
4. **HTTPS**: Always use HTTPS in production
5. **CORS**: Configure CORS appropriately for your domain

## Troubleshooting

### Connection Error
- Check if your MongoDB URI is correct
- Verify IP address is whitelisted in Network Access
- Ensure credentials are correct

### Authentication Errors
- Clear browser cookies and localStorage
- Verify JWT_SECRET matches between frontend and backend
- Check token expiration (set to 7 days)

### Collection Not Found
- Collections are created automatically on first use
- If issues persist, manually create collections in MongoDB Atlas

## Support

For MongoDB documentation, visit: https://docs.mongodb.com/
For issues with this application, check the GitHub repository.
