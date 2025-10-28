# BookIt - System Architecture

This document provides a comprehensive overview of the BookIt application architecture, design decisions, and data flow.

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           React App (TypeScript + Vite)             │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │   │
│  │  │  Pages   │  │Components│  │  Services (API)  │  │   │
│  │  └──────────┘  └──────────┘  └──────────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTP/REST
                      │ (JSON)
┌─────────────────────▼───────────────────────────────────────┐
│                       Server Layer                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │        Express.js Server (TypeScript)               │   │
│  │  ┌────────────┐  ┌────────────┐  ┌──────────────┐  │   │
│  │  │   Routes   │  │Controllers │  │   Database   │  │   │
│  │  └────────────┘  └────────────┘  │   Client     │  │   │
│  │                                   └──────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────┬───────────────────────────────────────┘
                      │ SQL
                      │ (PostgreSQL Protocol)
┌─────────────────────▼───────────────────────────────────────┐
│                      Data Layer                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              PostgreSQL Database                     │   │
│  │  ┌────────────┐ ┌──────┐ ┌──────────┐ ┌──────────┐ │   │
│  │  │Experiences │ │Slots │ │ Bookings │ │  Promos  │ │   │
│  │  └────────────┘ └──────┘ └──────────┘ └──────────┘ │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Database Schema

### ER Diagram

```
┌─────────────────┐       ┌──────────────┐       ┌──────────────┐
│  experiences    │       │    slots     │       │   bookings   │
├─────────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK)         │◄─────┤experience_id │       │ id (PK)      │
│ title           │       │  (FK)        │◄─────┤slot_id (FK)  │
│ description     │       │ id (PK)      │      │experience_id │
│ location        │       │ date         │      │  (FK)        │
│ price           │       │ time         │      │reference_id  │
│ image_url       │       │available_seats│     │full_name     │
│ about           │       │total_seats   │      │email         │
│ created_at      │       │ created_at   │      │quantity      │
└─────────────────┘       └──────────────┘      │promo_code    │
                                                  │discount      │
        ┌──────────────┐                         │subtotal      │
        │ promo_codes  │                         │taxes         │
        ├──────────────┤                         │total         │
        │ id (PK)      │                         │booking_date  │
        │ code (UNIQUE)│                         │status        │
        │ discount_type│                         └──────────────┘
        │ discount_val │
        │ is_active    │
        │ created_at   │
        └──────────────┘
```

### Table Relationships

- **experiences** 1:N **slots** (One experience has many time slots)
- **bookings** N:1 **experiences** (Many bookings reference one experience)
- **bookings** N:1 **slots** (Many bookings reference one slot)
- **promo_codes** has no direct FK relationship (validated by code string)

## 🔄 Data Flow

### 1. Browse Experiences Flow

```
User → [Home Page] → HTTP GET /api/experiences
                  ↓
            [Backend Router] → [experienceController.getAllExperiences]
                  ↓
            [Database Query: SELECT * FROM experiences]
                  ↓
            [Return JSON Array] → Frontend renders ExperienceCard[]
```

### 2. View Experience Details Flow

```
User clicks "View Details" → Navigate to /experience/:id
                           ↓
                [HTTP GET /api/experiences/:id]
                           ↓
            [experienceController.getExperienceById]
                           ↓
    [Database Queries: 
     1. SELECT experience WHERE id = :id
     2. SELECT slots WHERE experience_id = :id AND date >= TODAY]
                           ↓
    [Return JSON with experience + slots array]
                           ↓
    [Frontend renders Details page with date/time selection]
```

### 3. Booking Creation Flow (Critical)

```
User fills checkout form → Clicks "Pay and Confirm"
                         ↓
            [POST /api/bookings with booking data]
                         ↓
        [bookingController.createBooking]
                         ↓
        ┌─────────────────────────────────┐
        │   BEGIN TRANSACTION             │
        ├─────────────────────────────────┤
        │ 1. Lock slot (FOR UPDATE)       │
        │ 2. Check availability           │
        │ 3. Validate promo code (if any) │
        │ 4. Calculate totals             │
        │ 5. Generate reference ID        │
        │ 6. INSERT into bookings         │
        │ 7. UPDATE slot availability     │
        │ 8. COMMIT                       │
        └─────────────────────────────────┘
                         ↓
        [Return booking with reference_id]
                         ↓
        [Navigate to /confirmation with booking data]
```

### 4. Promo Code Validation Flow

```
User enters promo code → Clicks "Apply"
                       ↓
        [POST /api/promo/validate with {code, subtotal}]
                       ↓
        [bookingController.validatePromoCode]
                       ↓
        [Database Query: SELECT * FROM promo_codes WHERE code = :code]
                       ↓
        ┌─────────────────────────────┐
        │ If found and active:        │
        │   Calculate discount        │
        │   Return {valid: true, ...} │
        │ Else:                        │
        │   Return {valid: false}     │
        └─────────────────────────────┘
                       ↓
        [Frontend updates UI with discount or error]
```

## 🎨 Frontend Architecture

### Component Hierarchy

```
App (Router)
├── Home
│   ├── Header (with search)
│   └── ExperienceCard[] (grid)
├── Details
│   ├── Header (no search)
│   ├── Experience Image & Info
│   ├── Date Selection (buttons)
│   ├── Time Slot Selection (buttons)
│   └── Booking Summary (sidebar)
├── Checkout
│   ├── Header (no search)
│   ├── User Form (left)
│   │   ├── Name Input
│   │   ├── Email Input
│   │   ├── Promo Code Input + Apply
│   │   └── Terms Checkbox
│   └── Booking Summary (right)
└── Confirmation
    ├── Header (no search)
    └── Success Message + Reference ID
```

### State Management

**Local Component State** (useState):
- Form inputs (name, email, promo code)
- Selected date/time
- Quantity
- Loading states
- Error states

**Route State** (React Router location.state):
- Experience data (passed from Details → Checkout)
- Slot data
- Booking data (passed to Confirmation)

**Why no Redux/Context?**
- Simple linear flow (Home → Details → Checkout → Confirmation)
- Data passed through routes, no global state needed
- Keeps bundle size small

## 🔐 Security Considerations

### Implemented

1. **SQL Injection Prevention**: Parameterized queries with `pg`
2. **CORS Configuration**: Restricts API access to frontend domain
3. **Input Validation**: Required fields, email validation
4. **Transaction Locking**: Prevents double-booking with `FOR UPDATE`
5. **Environment Variables**: Sensitive data not in code

### Not Implemented (Production TODO)

1. **Authentication**: No user login (consider JWT for v2)
2. **Rate Limiting**: No API rate limits (add express-rate-limit)
3. **Payment Integration**: Mock payment (integrate Stripe/Razorpay)
4. **HTTPS**: Handled by hosting platforms
5. **Input Sanitization**: Basic validation only

## 🚀 Performance Optimizations

### Current Optimizations

1. **Database Indexes**:
   - `idx_slots_experience_date` for fast slot lookups
   - `idx_bookings_reference` for booking retrieval
   - `idx_promo_codes_code` for promo validation

2. **Frontend**:
   - Code splitting with React Router
   - Vite's optimized production build
   - Image lazy loading (browser native)
   - TailwindCSS purging (removes unused styles)

3. **Backend**:
   - Connection pooling with `pg.Pool`
   - Single database connection reused
   - Efficient SQL queries (no N+1 problems)

### Future Optimizations

1. **Caching**:
   - Redis for experience listings
   - Browser caching with proper headers
   - CDN for static assets

2. **Database**:
   - Read replicas for scaling reads
   - Partitioning bookings by date
   - Materialized views for stats

3. **Frontend**:
   - Service Worker for offline support
   - Progressive image loading
   - Virtual scrolling for large lists

## 🧪 Testing Strategy

### Manual Testing (Current)

- [x] Browse experiences
- [x] Search functionality
- [x] View details with slots
- [x] Select date and time
- [x] Complete booking
- [x] Apply promo codes
- [x] Verify confirmation

### Automated Testing (Recommended)

**Backend** (Jest + Supertest):
```javascript
// Example tests
- POST /api/bookings should create booking
- POST /api/bookings should prevent double-booking
- POST /api/promo/validate should validate codes
- GET /api/experiences should return all experiences
```

**Frontend** (Vitest + Testing Library):
```javascript
// Example tests
- Home page renders experience cards
- Details page shows slots
- Checkout form validates inputs
- Promo code applies discount
```

## 📈 Scalability Considerations

### Current Capacity

With current setup:
- **Database**: PostgreSQL free tier (~1GB)
- **Backend**: Render free tier (750 hours/month)
- **Frontend**: Vercel unlimited hobby projects

**Expected Load**:
- ~100 concurrent users
- ~1000 bookings/day
- ~10,000 experience views/day

### Scaling Path

**Phase 1** (0-1K users):
- Current setup sufficient
- Monitor database size

**Phase 2** (1K-10K users):
- Upgrade to paid tiers
- Add Redis caching
- CDN for images

**Phase 3** (10K+ users):
- Load balancer for backend
- Read replicas for database
- Microservices (booking, search separate)
- Message queue for emails

## 🔄 API Design Decisions

### REST vs GraphQL

**Choice**: REST
**Reasons**:
- Simple CRUD operations
- No complex nested queries
- Better caching with HTTP
- Easier to debug

### Endpoint Structure

```
/api/experiences          → GET (list)
/api/experiences/:id      → GET (single with slots)
/api/bookings            → POST (create)
/api/promo/validate      → POST (validate)
```

**Why POST for promo validate?**
- Requires body (code + subtotal)
- Not idempotent (could track usage in future)
- Consistent with booking endpoint

## 🎯 Design Patterns Used

1. **MVC Pattern**: Controllers handle business logic, Routes define endpoints
2. **Repository Pattern**: Database access centralized in controllers
3. **Service Layer**: API client (`api.ts`) abstracts HTTP calls
4. **Component Composition**: Reusable components (Header, Card, Spinner)
5. **Container/Presenter**: Pages (containers) use components (presenters)

## 🐛 Error Handling

### Backend

```typescript
try {
  // Operation
} catch (error) {
  console.error('Error:', error);
  res.status(500).json({ error: 'User-friendly message' });
}
```

### Frontend

```typescript
try {
  const data = await api.call();
  // Success
} catch (error) {
  console.error('Error:', error);
  alert('User-friendly message');
}
```

**Improvement TODO**: Implement global error boundary and toast notifications

## 📱 Responsive Design

### Breakpoints (TailwindCSS)

- **Mobile**: < 640px (default)
- **Tablet**: 640px - 1024px (sm, md)
- **Desktop**: > 1024px (lg, xl)

### Key Responsive Features

- Grid columns: 1 (mobile) → 2 (tablet) → 4 (desktop)
- Sidebar: Stacks below on mobile, side-by-side on desktop
- Header: Hamburger menu on mobile (future improvement)
- Forms: Full width on mobile, split on desktop

## 🎨 UI/UX Decisions

### Color Scheme
- **Primary**: Yellow/Gold (#FCD34D) - Action, CTA
- **Background**: Light Gray (#F5F5F5) - Reduces eye strain
- **Text**: Gray-900, Gray-600 - Proper contrast
- **Success**: Green - Confirmation
- **Error**: Red - Validation errors

### Typography
- **Font**: Inter (modern, clean, readable)
- **Headings**: Bold 600-700
- **Body**: Regular 400
- **Scale**: Base 16px, scales up for headings

### Interaction Patterns
- **Buttons**: Clear hover states, disabled states
- **Forms**: Inline validation, clear error messages
- **Loading**: Spinner for async operations
- **Feedback**: Immediate response on user actions

## 🔮 Future Enhancements

### Phase 1 (MVP+)
- [ ] User authentication (login/signup)
- [ ] Booking history
- [ ] Email confirmations
- [ ] Reviews and ratings

### Phase 2 (Growth)
- [ ] Payment integration (Stripe/Razorpay)
- [ ] Real-time availability updates (WebSockets)
- [ ] Admin dashboard
- [ ] Booking modifications/cancellations

### Phase 3 (Scale)
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced search filters
- [ ] Recommendation engine
- [ ] Analytics dashboard

---

**This architecture is designed for clarity, maintainability, and scalability.**

