# LuxeRide - Quick Start Guide

Get the LuxeRide car rental application up and running in 5 minutes.

## 1️⃣ Clone/Download Repository

If you haven't already, download the project and navigate to the project directory.

## 2️⃣ Set Up MongoDB

### Quick MongoDB Atlas Setup (Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (M0 free tier)
4. Go to "Database Access" → Add a database user
5. Go to "Network Access" → Add your IP (or allow all: 0.0.0.0/0)
6. Click "Connect" → "Drivers" → Copy the connection string
7. Replace `<username>:<password>` with your credentials

For detailed setup, see `MONGODB_SETUP.md`

## 3️⃣ Configure Environment Variables

Create `.env.local` in the project root:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/luxeride?retryWrites=true&w=majority
MONGODB_DB=luxeride
JWT_SECRET=your-super-secret-key-change-in-production
NODE_ENV=development
```

## 4️⃣ Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

This installs:
- MongoDB driver
- JWT for authentication
- Bcryptjs for password hashing
- And all other dependencies

## 5️⃣ Start Development Server

```bash
npm run dev
```

The app will be available at: `http://localhost:3000`

## 🧪 Test the Application

### 1. Sign Up
- Go to `http://localhost:3000/signup`
- Create an account with:
  - Full Name: John Doe
  - Email: john@example.com
  - Password: password123

### 2. Login
- Go to `http://localhost:3000/login`
- Login with the credentials you just created

### 3. Browse Features
- **Home** - Hero section with fleet overview
- **Cars** - Browse all luxury vehicles
- **About** - Learn about LuxeRide
- **Process** - Understand the rental process
- **Profile** - View your profile and payment history

## 🔑 Key Features Enabled

✅ **User Authentication**
- Sign up with email and password
- Secure login
- JWT-based sessions
- Profile management

✅ **Booking System**
- View car details
- Create bookings (ready for integration)
- View booking history

✅ **Payment Tracking**
- View payment history
- Payment records stored in MongoDB
- Multiple payment methods supported

✅ **Dark Mode**
- Toggle dark/light theme
- Gruvbox-inspired dark colors
- Smooth transitions

✅ **Responsive Design**
- Mobile-friendly
- Touch-optimized
- Fast and smooth

## 📁 Important Files

| File | Purpose |
|------|---------|
| `app/api/auth/` | Login and signup endpoints |
| `app/api/users/profile/` | User profile API |
| `app/api/bookings/` | Booking management API |
| `app/api/payments/` | Payment tracking API |
| `lib/db/models/` | MongoDB data models |
| `components/auth-form.tsx` | Login/signup form |
| `components/profile-content.tsx` | User profile display |

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
- Check your MONGODB_URI is correct
- Verify IP is whitelisted in MongoDB Atlas Network Access
- Ensure credentials are correct

### "Token is invalid"
- Clear localStorage: `localStorage.clear()`
- Clear cookies in browser
- Sign out and login again

### "Module not found"
- Run `npm install` again
- Delete `node_modules` and `.next` folders
- Run `npm install` and `npm run dev` again

## 📚 Documentation

- `MONGODB_SETUP.md` - Detailed MongoDB setup instructions
- `BACKEND_INTEGRATION.md` - Complete API documentation
- `MONGODB_SETUP.md` - Database schema details

## 🚀 Next Steps

1. ✅ Complete steps 1-5 above
2. Create sample bookings and payments
3. Customize the design with your branding
4. Add additional features:
   - Email notifications
   - SMS updates
   - Real payment integration (Stripe, Razorpay)
   - Admin dashboard
   - Advanced analytics

## 💡 Tips

- Use MongoDB Atlas free tier for development
- Always change `JWT_SECRET` before deploying
- Enable HTTPS in production
- Use environment variables for all secrets
- Test all API endpoints before going live

## 🆘 Need Help?

- Check the documentation files
- Review API responses in browser console
- Check Next.js logs in terminal
- Verify MongoDB connection in Atlas

---

**Happy coding! 🚗✨**
