export interface Experience {
  id: number;
  title: string;
  description: string;
  location: string;
  price: number;
  image_url: string;
  about?: string;
  slots?: Slot[];
}

export interface Slot {
  id: number;
  experience_id: number;
  date: string;
  time: string;
  available_seats: number;
  total_seats: number;
}

export interface Booking {
  experience_id: number;
  slot_id: number;
  full_name: string;
  email: string;
  quantity: number;
  promo_code?: string;
}

export interface BookingResponse {
  success: boolean;
  booking: {
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
    status: string;
  };
}

export interface PromoCodeValidation {
  valid: boolean;
  discount_type?: 'percentage' | 'flat';
  discount_value?: number;
  discount?: number;
  error?: string;
}

