# LuxeRide - Premium Car Rental Service

A modern, full-stack car rental application built with Next.js and MongoDB.

## 🚀 Quick Start

Get up and running in 5 minutes:

```bash
# 1. Install dependencies
npm install

# 2. Configure environment (see .env.example)
cp .env.example .env.local
# Edit .env.local with your MongoDB URI and JWT secret

# 3. Start development server
npm run dev
```

Visit: `http://localhost:3000`

**For detailed setup instructions, see `QUICKSTART.md`**

---

## 📚 Documentation Guide

Choose what you need:

### 🟢 **Just Want to Get Started?**
→ Read **`QUICKSTART.md`** (5 minute setup)

### 🔧 **Setting Up MongoDB?**
→ Read **`MONGODB_SETUP.md`** (detailed database guide)

### 🔌 **Building with the API?**
→ Read **`BACKEND_INTEGRATION.md`** (complete API reference)

### 📋 **What Was Built?**
→ Read **`IMPLEMENTATION_SUMMARY.md`** (technical overview)

### ✅ **Did We Complete Everything?**
→ Read **`COMPLETION_CHECKLIST.md`** (feature checklist)

---

## ✨ Features

### User Management
- 🔐 Secure user registration and login
- 🔑 JWT-based authentication
- 👤 Profile management and updates
- 🚪 Secure logout with token cleanup

### Car Catalog
- 🚗 Browse 6 luxury vehicles
- 📸 High-quality car images
- 💰 Realistic INR pricing (₹4,800 - ₹7,200/day)
- 📊 Detailed car specifications
- ⭐ Category filtering

### Booking System
- 📅 Create car rental bookings
- 📜 View booking history
- 🔍 QR code verification support
- 📍 Pickup/dropoff locations
- 💳 Multiple payment methods

### Payment Tracking
- 💰 Record payment transactions
- 📈 Complete payment history
- 🏦 Multiple payment methods (card, wallet, UPI, cash)
- ✔️ Payment status tracking

### Theme & Design
- 🌙 Dark mode with Gruvbox colors
- ☀️ Professional light theme
- 📱 Fully responsive design
- ✨ Smooth animations and transitions
- ♿ Accessibility features

### Premium Pages
- 🏠 Hero section with smooth scrolling
- ℹ️ About company page
- 🚗 Complete cars catalog with details
- 📖 How rental process works
- 👤 User profile dashboard
- 🔐 Secure authentication pages

---

## 🏗️ Architecture

### Frontend
- React 19 with Next.js 16
- Tailwind CSS for styling
- Client-side state management
- Smooth animations and transitions

### Backend
- Next.js API routes
- JWT authentication
- Bcryptjs password hashing
- MongoDB driver integration

### Database
- MongoDB (Atlas recommended)
- 3 main collections: Users, Bookings, Payments
- Indexed for performance
- Supports future scaling

### Security
- Password hashing (bcryptjs, 10 rounds)
- JWT tokens (7-day expiration)
- HTTP-only secure cookies
- Protected API endpoints
- Input validation

---

## 📁 Project Structure

```
luxeride/
├── app/
│   ├── api/              # API endpoints
│   │   ├── auth/         # Authentication routes
│   │   ├── bookings/     # Booking endpoints
│   │   ├── payments/     # Payment endpoints
│   │   └── users/        # User endpoints
│   ├── [pages]/          # Application pages
│   ├── globals.css       # Global styles
│   └── layout.tsx        # Root layout
├── components/           # React components
│   ├── auth-form.tsx
│   ├── profile-content.tsx
│   ├── cars-showcase.tsx
│   ├── hero.tsx
│   └── navigation.tsx
├── lib/
│   ├── db/               # Database layer
│   │   ├── models/       # MongoDB models
│   │   └── mongodb.ts    # DB connection
│   ├── auth/             # Authentication
│   ├── types.ts          # TypeScript types
│   └── utils.ts          # Utilities
├── public/               # Static assets
│   └── cars/             # Car images
├── docs/                 # Documentation
└── package.json          # Dependencies
```

---

## 🔐 Security Features

- ✅ Bcryptjs password hashing (10 rounds)
- ✅ JWT tokens with expiration
- ✅ HTTP-only secure cookies
- ✅ Protected API endpoints
- ✅ Input validation
- ✅ No sensitive data in responses
- ✅ Environment variable protection

---

## 🚗 Available Cars

All cars are available in India with realistic pricing:

1. **BMW 7 Series** - ₹5,500/day
2. **Mercedes-Benz E-Class** - ₹5,200/day
3. **Audi Q7** - ₹6,000/day
4. **Jaguar XE** - ₹4,800/day
5. **Range Rover Velar** - ₹7,200/day
6. **Tesla Model S** - ₹5,800/day

---

## 💾 Environment Variables

Create `.env.local` in the project root:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/luxeride
MONGODB_DB=luxeride

# Authentication
JWT_SECRET=your-secret-key-here-change-in-production

# Environment
NODE_ENV=development
```

See `.env.example` for the template.

---

## 🌐 API Endpoints

All endpoints require authentication (JWT token):

### Authentication
- `POST /api/auth/signup` - Register
- `POST /api/auth/login` - Login

### User Profile
- `GET /api/users/profile` - Fetch profile
- `PUT /api/users/profile` - Update profile

### Bookings
- `GET /api/bookings` - Get bookings
- `POST /api/bookings` - Create booking

### Payments
- `GET /api/payments` - Get payments
- `POST /api/payments` - Record payment

For detailed API docs, see `BACKEND_INTEGRATION.md`

---

## 🧪 Testing

### Test Sign Up
1. Navigate to http://localhost:3000/signup
2. Create account with email and password
3. Should redirect to profile page

### Test Login
1. Navigate to http://localhost:3000/login
2. Login with created credentials
3. View profile and payment history

### Test API with cURL
```bash
# Signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Get Profile (replace TOKEN)
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer TOKEN"
```

---

## 📦 Dependencies

### Production
- `next` - Framework
- `react` - UI library
- `tailwindcss` - Styling
- `mongodb` - Database driver
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT tokens
- `lucide-react` - Icons
- `next-themes` - Theme management

### Development
- `typescript` - Type safety
- `@types/node` - Node types
- `@types/react` - React types
- `tailwindcss` - CSS framework

See `package.json` for complete list.

---

## 🚀 Deployment

### Before Deploying
- [ ] Change JWT_SECRET to secure value
- [ ] Set NODE_ENV to production
- [ ] Enable HTTPS
- [ ] Configure MongoDB Atlas IP whitelist
- [ ] Review security settings

### Deploy to Vercel
1. Push code to GitHub
2. Connect GitHub repo to Vercel
3. Add environment variables
4. Deploy with `vercel`

For other platforms (AWS, Heroku, etc.), see `BACKEND_INTEGRATION.md`

---

## 🐛 Troubleshooting

### MongoDB Connection Error
- Check MONGODB_URI is correct
- Verify IP is whitelisted in MongoDB Atlas
- Ensure credentials are correct

### Authentication Errors
- Clear localStorage: `localStorage.clear()`
- Clear cookies in browser
- Check JWT_SECRET matches

### Module Not Found
- Delete `node_modules` and `.next`
- Run `npm install` again
- Run `npm run dev`

See `QUICKSTART.md` for more troubleshooting.

---

## 📞 Support

### Getting Help
1. **Quick Setup?** → `QUICKSTART.md`
2. **Database Setup?** → `MONGODB_SETUP.md`
3. **API Reference?** → `BACKEND_INTEGRATION.md`
4. **Technical Details?** → `IMPLEMENTATION_SUMMARY.md`
5. **Features Checklist?** → `COMPLETION_CHECKLIST.md`

### Common Issues
- See `QUICKSTART.md` - Troubleshooting section
- See `MONGODB_SETUP.md` - Troubleshooting section

---

## 📚 Learning Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/)
- [JWT Tokens](https://jwt.io)

---

## 📄 License

This project is provided as-is for educational and commercial use.

---

## 🙏 Credits

Built with:
- Next.js 16
- React 19
- MongoDB
- Tailwind CSS
- Shadcn/ui components

---

## 🎯 What's Next?

### Short Term
- ✅ User authentication working
- ✅ Profile management ready
- ✅ Booking system structure
- ✅ Payment tracking infrastructure

### Medium Term
- 🔄 Email notifications
- 🔄 SMS alerts
- 🔄 Advanced booking features
- 🔄 Analytics dashboard

### Long Term
- 🔄 Payment gateway integration (Stripe/Razorpay)
- 🔄 Admin dashboard
- 🔄 Mobile app
- 🔄 Advanced analytics

---

**Happy renting! 🚗✨**

*For any questions, refer to the documentation files in this project.*
