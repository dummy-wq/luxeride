# Backend Integration Guide

This document explains the MongoDB backend integration in the LuxeRide application.

## Architecture Overview

The application uses a Next.js backend with MongoDB for data persistence. The architecture includes:

- **Frontend**: React components with Next.js App Router
- **API Routes**: Next.js API routes in `/app/api/`
- **Database Models**: MongoDB models in `/lib/db/models/`
- **Authentication**: JWT-based authentication with HTTP-only cookies

## File Structure

```
app/
├── api/
│   ├── auth/
│   │   ├── login/route.ts      # Login endpoint
│   │   └── signup/route.ts     # Signup endpoint
│   ├── users/
│   │   └── profile/route.ts    # User profile endpoints
│   ├── bookings/
│   │   └── route.ts            # Booking management
│   └── payments/
│       └── route.ts            # Payment management

lib/
├── db/
│   ├── mongodb.ts              # MongoDB connection
│   ├── models/
│   │   ├── user.ts             # User model
│   │   ├── booking.ts          # Booking model
│   │   └── payment.ts          # Payment model
├── auth/
│   └── verify.ts               # JWT verification utility

components/
├── auth-form.tsx               # Updated with API calls
└── profile-content.tsx         # Updated with API calls
```

## Key Features

### 1. User Authentication
- Password hashing with bcryptjs (10 rounds)
- JWT token generation (7-day expiry)
- HTTP-only secure cookies
- Email-based login/signup
- Profile updates

**Related Files:**
- `/app/api/auth/signup/route.ts`
- `/app/api/auth/login/route.ts`
- `/lib/db/models/user.ts`

### 2. Booking Management
- Create car rental bookings
- Track booking history by user
- Support for multiple booking statuses
- QR code generation support
- Number of days and pricing calculation

**Related Files:**
- `/app/api/bookings/route.ts`
- `/lib/db/models/booking.ts`

### 3. Payment Processing
- Record payment transactions
- Multiple payment methods (card, wallet, UPI, cash)
- Payment status tracking
- Link payments to bookings
- Transaction ID support

**Related Files:**
- `/app/api/payments/route.ts`
- `/lib/db/models/payment.ts`

### 4. Authentication Middleware
- JWT token verification
- Support for Bearer tokens and cookies
- Automatic user identification

**Related Files:**
- `/lib/auth/verify.ts`

## API Endpoints

### Authentication

#### POST /api/auth/signup
Register a new user.

**Request:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "userId": "507f1f77bcf86cd799439011"
}
```

#### POST /api/auth/login
Login existing user.

**Request:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "userId": "507f1f77bcf86cd799439011",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "fullName": "John Doe",
    "email": "john@example.com"
  }
}
```

### User Profile

#### GET /api/users/profile
Get current user's profile. Requires authentication.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+91-9876543210",
    "address": "123 Main St",
    "city": "Mumbai"
  }
}
```

#### PUT /api/users/profile
Update user's profile. Requires authentication.

**Request:**
```json
{
  "phone": "+91-9876543210",
  "address": "123 Main St",
  "city": "Mumbai"
}
```

**Response:**
```json
{
  "message": "Profile updated successfully",
  "user": { ... }
}
```

### Bookings

#### GET /api/bookings
Get user's booking history. Requires authentication.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "bookings": [
    {
      "id": "507f1f77bcf86cd799439011",
      "carId": 1,
      "carName": "BMW 7 Series",
      "startDate": "2024-02-20T10:00:00Z",
      "endDate": "2024-02-23T10:00:00Z",
      "numberOfDays": 3,
      "totalCost": 16500,
      "status": "confirmed"
    }
  ]
}
```

#### POST /api/bookings
Create a new booking. Requires authentication.

**Request:**
```json
{
  "carId": 1,
  "carName": "BMW 7 Series",
  "carPrice": 5500,
  "startDate": "2024-02-20T10:00:00Z",
  "endDate": "2024-02-23T10:00:00Z",
  "pickupLocation": "Mumbai",
  "dropoffLocation": "Pune",
  "numberOfDays": 3,
  "totalCost": 16500
}
```

**Response:**
```json
{
  "message": "Booking created successfully",
  "bookingId": "507f1f77bcf86cd799439011"
}
```

### Payments

#### GET /api/payments
Get user's payment history. Requires authentication.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "payments": [
    {
      "id": "507f1f77bcf86cd799439011",
      "bookingId": "507f1f77bcf86cd799439010",
      "amount": 16500,
      "paymentMethod": "card",
      "status": "completed",
      "createdAt": "2024-02-20T10:30:00Z"
    }
  ]
}
```

#### POST /api/payments
Create a new payment. Requires authentication.

**Request:**
```json
{
  "bookingId": "507f1f77bcf86cd799439010",
  "amount": 16500,
  "paymentMethod": "card",
  "currency": "INR",
  "transactionId": "TXN123456"
}
```

**Response:**
```json
{
  "message": "Payment created successfully",
  "paymentId": "507f1f77bcf86cd799439011"
}
```

## Frontend Integration

### AuthForm Component
The `AuthForm` component now:
- Validates input locally
- Sends credentials to appropriate API endpoint
- Stores JWT token in localStorage and HTTP-only cookies
- Displays error/success messages
- Redirects on successful authentication

**Usage:**
```tsx
import { AuthForm } from '@/components/auth-form'

export default function LoginPage() {
  return <AuthForm type="login" />
}
```

### ProfileContent Component
The `ProfileContent` component now:
- Fetches user data from `/api/users/profile`
- Fetches payment history from `/api/payments`
- Displays real data from MongoDB
- Handles loading and error states
- Supports logout with token cleanup

**Usage:**
```tsx
import { ProfileContent } from '@/components/profile-content'

export default function ProfilePage() {
  return <ProfileContent />
}
```

## Environment Variables

Create a `.env.local` file in the project root:

```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/luxeride?retryWrites=true&w=majority
MONGODB_DB=luxeride
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

**Important:** Never commit `.env.local` to version control.

## Security Considerations

1. **Password Security**
   - Passwords are hashed with bcryptjs (10 rounds of salt)
   - Raw passwords are never stored

2. **Token Security**
   - JWT tokens expire after 7 days
   - Tokens are stored in HTTP-only cookies (secure in production)
   - Also available in localStorage for API calls

3. **API Security**
   - All data endpoints require authentication
   - JWT verification on every request
   - Sensitive fields (passwordHash) are excluded from responses

4. **Database Security**
   - Use MongoDB Atlas IP whitelisting
   - Enable network access controls
   - Use strong credentials

## Error Handling

### Common Errors

**401 Unauthorized**
- Missing or invalid token
- Token expired
- Solution: Login again

**409 Conflict**
- Email already registered
- Solution: Use different email or login

**500 Internal Server Error**
- Server error, check logs
- Solution: Review console output

## Testing the API

### Using cURL

```bash
# Signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# Get Profile (replace TOKEN with actual token)
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer TOKEN"
```

## Next Steps

1. Set up MongoDB Atlas (see MONGODB_SETUP.md)
2. Configure environment variables
3. Install dependencies: `npm install`
4. Run development server: `npm run dev`
5. Test authentication flow
6. Build booking/payment features

## Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [JWT Documentation](https://jwt.io/)
- [Bcryptjs Documentation](https://www.npmjs.com/package/bcryptjs)
