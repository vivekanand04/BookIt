import { Router } from 'express';
import { getAllExperiences, getExperienceById } from '../controllers/experienceController';
import { createBooking, validatePromoCode } from '../controllers/bookingController';

const router = Router();

// Experience routes
router.get('/experiences', getAllExperiences);
router.get('/experiences/:id', getExperienceById);

// Booking routes
router.post('/bookings', createBooking);
router.post('/promo/validate', validatePromoCode);

export default router;

