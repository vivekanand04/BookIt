# BookIt: Travel Experiences & Slots

A full-stack web application for exploring, booking, and managing travel experiences with real-time slot availability.

## 🚀 Live Demo

- **Frontend**: [Your Vercel URL]
- **Backend**: [Your Render/Railway URL]
- **API Docs**: `[Backend URL]/api`

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [Database Setup](#database-setup)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Screenshots](#screenshots)

## ✨ Features

### User Features
- **Browse Experiences**: View a grid of curated travel experiences with images, descriptions, and pricing
- **Search Functionality**: Search experiences by title, location, or description
- **Real-time Slot Availability**: Check available dates and time slots with live seat counts
- **Smart Booking Flow**: Intuitive multi-step booking process (Browse → Details → Checkout → Confirmation)
- **Promo Code System**: Apply discount codes (percentage or flat) during checkout
- **Responsive Design**: Fully responsive UI that works on desktop, tablet, and mobile
- **Booking Confirmation**: Get a unique reference ID for each successful booking

### Technical Features
- **Atomic Transactions**: Prevent double-booking with database-level locking
- **Real-time Validation**: Immediate feedback on form inputs and promo codes
- **Error Handling**: Comprehensive error handling on both frontend and backend
- **Clean Architecture**: Separation of concerns with controllers, routes, and services
- **Type Safety**: Full TypeScript implementation for better developer experience

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18.2 with TypeScript
- **Build Tool**: Vite 5.0
- **Styling**: TailwindCSS 3.4
- **Routing**: React Router DOM 6.21
- **HTTP Client**: Axios 1.6
- **Font**: Inter (Google Fonts)

### Backend
- **Runtime**: Node.js
- **Framework**: Express 4.18
- **Language**: TypeScript 5.3
- **Database**: PostgreSQL
- **Database Client**: node-postgres (pg)
- **Tools**: tsx (for development), uuid (reference ID generation)

### DevOps & Deployment
- **Frontend Hosting**: Vercel / Netlify
- **Backend Hosting**: Render / Railway / AWS
- **Database Hosting**: Railway / Supabase / AWS RDS
- **Version Control**: Git & GitHub

## 📁 Project Structure

```
travel-project/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts          # Database connection
│   │   │   └── schema.sql           # SQL schema
│   │   ├── controllers/
│   │   │   ├── experienceController.ts
│   │   │   └── bookingController.ts
│   │   ├── routes/
│   │   │   └── index.ts             # API routes
│   │   ├── types/
│   │   │   └── index.ts             # TypeScript types
│   │   ├── server.ts                # Express server
│   │   └── seed.ts                  # Database seeding
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   ├── ExperienceCard.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Details.tsx
│   │   │   ├── Checkout.tsx
│   │   │   └── Confirmation.tsx
│   │   ├── services/
│   │   │   └── api.ts               # API client
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
└── README.md
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.0.0 or higher ([Download](https://nodejs.org/))
- **npm**: v9.0.0 or higher (comes with Node.js)
- **PostgreSQL**: v14.0 or higher ([Download](https://www.postgresql.org/download/))
- **Git**: Latest version ([Download](https://git-scm.com/))

Check your installations:
```bash
node --version
npm --version
psql --version
git --version
```

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/bookit-travel.git
cd bookit-travel
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## 🔐 Environment Variables

### Backend (.env)

Create a `.env` file in the `backend` directory:

```env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/bookit
NODE_ENV=development
```

**For Production (e.g., Render, Railway):**
```env
PORT=5000
DATABASE_URL=postgresql://username:password@host:5432/bookit?sslmode=require
NODE_ENV=production
```

### Frontend (.env)

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

**For Production (e.g., Vercel):**
```env
VITE_API_URL=https://your-backend-url.com/api
```

## 🗄️ Database Setup

### Option 1: Local PostgreSQL

1. **Create Database**
   ```bash
   psql -U postgres
   CREATE DATABASE bookit;
   \q
   ```

2. **Run Migrations & Seed Data**
   ```bash
   cd backend
   npm run seed
   ```

   This will:
   - Create all required tables (experiences, slots, bookings, promo_codes)
   - Insert sample experiences with images
   - Generate available slots for the next 7 days
   - Add promo codes (SAVE10, FLAT100, SAVE20, FLAT50)

### Option 2: Cloud Database (Railway/Supabase)

1. Create a PostgreSQL database on [Railway](https://railway.app/) or [Supabase](https://supabase.com/)
2. Copy the connection string
3. Update `DATABASE_URL` in your `.env` file
4. Run the seed script:
   ```bash
   cd backend
   npm run seed
   ```

## 🚀 Running Locally

### Start Backend

```bash
cd backend
npm run dev
```

Backend will run on: `http://localhost:5000`

**Endpoints:**
- Health check: `http://localhost:5000/health`
- API base: `http://localhost:5000/api`

### Start Frontend

In a new terminal:

```bash
cd frontend
npm run dev
```

Frontend will run on: `http://localhost:3000`

### Verify Setup

1. Open `http://localhost:3000` in your browser
2. You should see the home page with experience cards
3. Try searching for "Kayak" to test search functionality
4. Click "View Details" on any experience
5. Select a date and time slot
6. Complete the booking flow

## 🌐 API Endpoints

### Experiences

| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|--------------|
| GET | `/api/experiences` | Get all experiences | `search` (optional) |
| GET | `/api/experiences/:id` | Get experience by ID with slots | - |

### Bookings

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/api/bookings` | Create a new booking | `{ experience_id, slot_id, full_name, email, quantity, promo_code? }` |

### Promo Codes

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/api/promo/validate` | Validate promo code | `{ code, subtotal }` |

### Example API Calls

**Get All Experiences:**
```bash
curl http://localhost:5000/api/experiences
```

**Search Experiences:**
```bash
curl "http://localhost:5000/api/experiences?search=kayak"
```

**Create Booking:**
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "experience_id": 1,
    "slot_id": 5,
    "full_name": "John Doe",
    "email": "john@example.com",
    "quantity": 2,
    "promo_code": "SAVE10"
  }'
```

## 📤 Deployment

### Deploy Backend (Render)

1. **Create Account**: Sign up at [render.com](https://render.com)

2. **Create Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: bookit-backend
     - **Environment**: Node
     - **Build Command**: `cd backend && npm install && npm run build`
     - **Start Command**: `cd backend && npm start`

3. **Add Environment Variables**:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `NODE_ENV`: production
   - `PORT`: 5000

4. **Deploy**: Click "Create Web Service"

5. **Seed Database**:
   ```bash
   # In Render shell
   cd backend && npm run seed
   ```

### Deploy Frontend (Vercel)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   cd frontend
   vercel
   ```

3. **Configure**:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Add Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend-url.com/api`

5. **Redeploy**: `vercel --prod`

### Alternative Deployment Options

#### Backend Alternatives
- **Railway**: Similar to Render, easier PostgreSQL integration
- **AWS EC2**: More control, requires more setup
- **Heroku**: Simple deployment with Heroku Postgres

#### Frontend Alternatives
- **Netlify**: Similar to Vercel
- **GitHub Pages**: Free for static sites
- **AWS S3 + CloudFront**: Scalable, cost-effective

## 🎨 Design Fidelity

The application matches the provided Figma design with:
- **Color Scheme**: Yellow/gold primary (#FCD34D), clean white backgrounds
- **Typography**: Inter font family with proper weight hierarchy
- **Spacing**: Consistent padding and margins using Tailwind's spacing scale
- **Components**: Card-based layouts with rounded corners and subtle shadows
- **Responsive**: Mobile-first approach with breakpoints at sm (640px), md (768px), lg (1024px)

## 🧪 Testing the Application

### Test Promo Codes

Use these promo codes during checkout:
- `SAVE10` - 10% discount
- `FLAT100` - ₹100 flat discount
- `SAVE20` - 20% discount
- `FLAT50` - ₹50 flat discount

### Test Booking Flow

1. **Home Page**: Browse or search for experiences
2. **Details Page**: Select "Oct 22" (or first available date) and "09:00 am" slot
3. **Checkout**: 
   - Name: John Doe
   - Email: test@test.com
   - Promo: SAVE10
   - Check terms box
4. **Confirmation**: Note the reference ID (e.g., HUF56&SO)

### Verify Database

```sql
-- Check experiences
SELECT * FROM experiences;

-- Check available slots
SELECT * FROM slots WHERE available_seats > 0;

-- Check bookings
SELECT * FROM bookings ORDER BY booking_date DESC;

-- Check promo codes
SELECT * FROM promo_codes WHERE is_active = true;
```

## 🐛 Troubleshooting

### Backend Issues

**Database Connection Error:**
```bash
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution**: Ensure PostgreSQL is running:
```bash
# macOS
brew services start postgresql

# Windows
pg_ctl -D "C:\Program Files\PostgreSQL\14\data" start

# Linux
sudo systemctl start postgresql
```

**Port Already in Use:**
```bash
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Change port in `.env` or kill the process:
```bash
# macOS/Linux
lsof -ti:5000 | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Frontend Issues

**API Connection Error:**
```
AxiosError: Network Error
```
**Solution**: 
- Verify backend is running on port 5000
- Check `VITE_API_URL` in `.env`
- Ensure CORS is enabled in backend

**Build Error:**
```bash
Module not found: Can't resolve 'react-router-dom'
```
**Solution**: Reinstall dependencies:
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📝 License

This project is created as part of a fullstack internship assignment. Free to use for educational purposes.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

## 🙏 Acknowledgments

- Images from [Unsplash](https://unsplash.com) and [Pexels](https://pexels.com)
- Design inspiration from Highway Delite
- Icons from [Heroicons](https://heroicons.com)

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

**Made with ❤️ for Highway Delite**

