import axios from 'axios';
import { Experience, Booking, BookingResponse, PromoCodeValidation } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const experienceApi = {
  getAll: async (search?: string): Promise<Experience[]> => {
    const params = search ? { search } : {};
    const response = await api.get('/experiences', { params });
    return response.data;
  },

  getById: async (id: number): Promise<Experience> => {
    const response = await api.get(`/experiences/${id}`);
    return response.data;
  },
};

export const bookingApi = {
  create: async (booking: Booking): Promise<BookingResponse> => {
    const response = await api.post('/bookings', booking);
    return response.data;
  },

  validatePromo: async (code: string, subtotal: number): Promise<PromoCodeValidation> => {
    try {
      const response = await api.post('/promo/validate', { code, subtotal });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return { valid: false, error: 'Invalid or expired promo code' };
      }
      throw error;
    }
  },
};

export default api;

