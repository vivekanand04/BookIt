export interface Experience {
  id: number;
  title: string;
  description: string;
  location: string;
  price: number;
  image_url: string;
  about?: string;
  created_at?: Date;
}

export interface Slot {
  id: number;
  experience_id: number;
  date: string;
  time: string;
  available_seats: number;
  total_seats: number;
  created_at?: Date;
}

export interface Booking {
  id?: number;
  reference_id: string;
  experience_id: number;
  slot_id: number;
  full_name: string;
  email: string;
  quantity: number;
  promo_code?: string;
  discount: number;
  subtotal: number;
  taxes: number;
  total: number;
  booking_date?: Date;
  status?: string;
}

export interface PromoCode {
  id: number;
  code: string;
  discount_type: 'percentage' | 'flat';
  discount_value: number;
  is_active: boolean;
  created_at?: Date;
}

export interface BookingRequest {
  experience_id: number;
  slot_id: number;
  full_name: string;
  email: string;
  quantity: number;
  promo_code?: string;
}

