# BookIt: Travel Experiences & Slots

A full-stack web application for exploring, booking, and managing travel experiences with real-time slot availability.

## 🚀 Live Demo

- **Frontend**:https://bookit-frontend-zsv6.onrender.com
- **Backend**:https://bookit-backend-1oka.onrender.com



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
- **Frontend Hosting**: Render
- **Backend Hosting**: Render
- **Database Hosting**: Neon
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


## 🐛 Troubleshooting


## 📝 License

This project is created as part of a fullstack internship assignment. Free to use for educational purposes.

## 👨‍💻 Author

- LinkedIn: https://www.linkedin.com/in/vivekanand04/
- Email: vivekathirr02@gmail.com


## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

**Made with ❤️ for Highway Delite**

