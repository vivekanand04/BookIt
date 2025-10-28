# 🚀 Quick Start Guide - BookIt

Get the BookIt application running locally in under 10 minutes!

## Prerequisites Check

Make sure you have these installed:
```bash
node --version   # Should be v18.0.0 or higher
npm --version    # Should be v9.0.0 or higher
psql --version   # Should be v14.0 or higher
```

If not installed, download:
- Node.js: https://nodejs.org/
- PostgreSQL: https://www.postgresql.org/download/

## Step 1: Clone and Install (2 minutes)

```bash
# Clone the repository
cd "C:\Users\Lenovo\Desktop\travel project"

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## Step 2: Setup Database (2 minutes)

### Create PostgreSQL Database

**Windows (PowerShell):**
```powershell
# Start PostgreSQL service (if not running)
# Then create database
psql -U postgres
```

**In psql prompt:**
```sql
CREATE DATABASE bookit;
\q
```

### Configure Environment

**Backend** - Create `backend/.env`:
```env
PORT=5000
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/bookit
NODE_ENV=development
```
Replace `your_password` with your PostgreSQL password.

**Frontend** - Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

## Step 3: Seed Database (1 minute)

```bash
cd backend
npm run seed
```

Expected output:
```
✓ Tables created
✓ Existing data cleared
✓ Experiences inserted
✓ Slots inserted
✓ Promo codes inserted

✅ Database seeding completed successfully!
```

## Step 4: Start Application (1 minute)

### Terminal 1 - Start Backend:
```bash
cd backend
npm run dev
```

Wait for:
```
🚀 Server is running on port 5000
📡 API: http://localhost:5000/api
Database connected successfully
```

### Terminal 2 - Start Frontend:
```bash
cd frontend
npm run dev
```

Wait for:
```
VITE v5.0.8  ready in 500 ms

➜  Local:   http://localhost:3000/
➜  press h to show help
```

## Step 5: Test the Application (2 minutes)

### Open Browser
Go to: http://localhost:3000

### Test Booking Flow

1. **Home Page**: 
   - You should see 8 experience cards
   - Try searching for "Kayak"

2. **Details Page**:
   - Click "View Details" on any experience
   - Select first available date (highlighted in yellow)
   - Select "09:00 am" time slot
   - Increase quantity to 2
   - Click "Confirm"

3. **Checkout Page**:
   - Full name: `John Doe`
   - Email: `test@example.com`
   - Promo code: `SAVE10` (click Apply)
   - Check "I agree to terms..."
   - Click "Pay and Confirm"

4. **Confirmation Page**:
   - Note your booking reference ID
   - Click "Back to Home"

### ✅ Success!

If you see the confirmation page with a reference ID, everything is working!

## Common Issues & Fixes

### Issue: "Database connection error"

**Windows:**
```powershell
# Check if PostgreSQL is running
Get-Service -Name postgresql*

# If not running, start it
Start-Service postgresql-x64-14
```

### Issue: "Port 5000 already in use"

**Fix 1** - Kill the process:
```powershell
# Find process on port 5000
netstat -ano | findstr :5000

# Kill it (replace PID)
taskkill /PID <PID> /F
```

**Fix 2** - Change port in `backend/.env`:
```env
PORT=5001
```
And update frontend `.env`:
```env
VITE_API_URL=http://localhost:5001/api
```

### Issue: "npm install fails"

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: "Seed script fails"

Make sure:
1. PostgreSQL is running
2. Database "bookit" exists
3. Connection string in `.env` is correct
4. User has proper permissions

```sql
-- Check connection
psql -U postgres -d bookit -c "SELECT 1;"
```

## Available Promo Codes

Test these during checkout:
- `SAVE10` - 10% off
- `FLAT100` - ₹100 off
- `SAVE20` - 20% off
- `FLAT50` - ₹50 off

## Next Steps

### Development
- Make changes to frontend: `frontend/src/`
- Make changes to backend: `backend/src/`
- Changes auto-reload with hot module replacement

### View Database
```bash
psql -U postgres -d bookit

# Check data
SELECT * FROM experiences;
SELECT * FROM slots LIMIT 10;
SELECT * FROM bookings;
SELECT * FROM promo_codes;
```

### Stop Services
```bash
# In each terminal, press Ctrl+C

# Or close terminals
```

### Deployment
When ready to deploy, follow: `DEPLOYMENT.md`

## Project Structure Overview

```
travel-project/
├── backend/
│   ├── src/
│   │   ├── config/        # Database setup
│   │   ├── controllers/   # Business logic
│   │   ├── routes/        # API endpoints
│   │   └── server.ts      # Entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Route pages
│   │   ├── services/      # API calls
│   │   └── App.tsx        # Main app
│   └── package.json
└── README.md              # Full documentation
```

## Helpful Commands

```bash
# Backend
cd backend
npm run dev        # Start development server
npm run build      # Build for production
npm start          # Start production server
npm run seed       # Seed database

# Frontend
cd frontend
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build

# Database
psql -U postgres -d bookit                    # Connect to database
psql -U postgres -d bookit -f schema.sql      # Run SQL file
```

## Support

- Full Documentation: `README.md`
- Deployment Guide: `DEPLOYMENT.md`
- Architecture: `ARCHITECTURE.md`

## 🎉 You're All Set!

The application is now running locally. Happy coding!

---

**Made with ❤️ for Highway Delite**

