import { Request, Response } from 'express';
import pool from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import { BookingRequest } from '../types';

export const createBooking = async (req: Request, res: Response) => {
  const client = await pool.connect();
  
  try {
    const bookingData: BookingRequest = req.body;
    
    // Validate required fields
    if (!bookingData.experience_id || !bookingData.slot_id || !bookingData.full_name || !bookingData.email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    await client.query('BEGIN');
    
    // Check slot availability
    const slotResult = await client.query(
      'SELECT * FROM slots WHERE id = $1 FOR UPDATE',
      [bookingData.slot_id]
    );
    
    if (slotResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Slot not found' });
    }
    
    const slot = slotResult.rows[0];
    
    if (slot.available_seats < bookingData.quantity) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Not enough seats available' });
    }
    
    // Get experience price
    const experienceResult = await client.query(
      'SELECT price FROM experiences WHERE id = $1',
      [bookingData.experience_id]
    );
    
    const experience = experienceResult.rows[0];
    let subtotal = experience.price * bookingData.quantity;
    let discount = 0;
    
    // Apply promo code if provided
    if (bookingData.promo_code) {
      const promoResult = await client.query(
        'SELECT * FROM promo_codes WHERE code = $1 AND is_active = true',
        [bookingData.promo_code.toUpperCase()]
      );
      
      if (promoResult.rows.length > 0) {
        const promo = promoResult.rows[0];
        if (promo.discount_type === 'percentage') {
          discount = (subtotal * promo.discount_value) / 100;
        } else {
          discount = promo.discount_value;
        }
      }
    }
    
    const discountedSubtotal = subtotal - discount;
    const taxes = Math.round(discountedSubtotal * 0.06); // 6% tax
    const total = discountedSubtotal + taxes;
    
    // Generate reference ID
    const referenceId = uuidv4().split('-')[0].toUpperCase() + uuidv4().split('-')[1].toUpperCase();
    
    // Create booking
    const bookingResult = await client.query(
      `INSERT INTO bookings (
        reference_id, experience_id, slot_id, full_name, email, quantity,
        promo_code, discount, subtotal, taxes, total, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'confirmed')
      RETURNING *`,
      [
        referenceId,
        bookingData.experience_id,
        bookingData.slot_id,
        bookingData.full_name,
        bookingData.email,
        bookingData.quantity,
        bookingData.promo_code || null,
        discount,
        subtotal,
        taxes,
        total
      ]
    );
    
    // Update slot availability
    await client.query(
      'UPDATE slots SET available_seats = available_seats - $1 WHERE id = $2',
      [bookingData.quantity, bookingData.slot_id]
    );
    
    await client.query('COMMIT');
    
    res.status(201).json({
      success: true,
      booking: bookingResult.rows[0]
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  } finally {
    client.release();
  }
};

export const validatePromoCode = async (req: Request, res: Response) => {
  try {
    const { code, subtotal } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Promo code is required' });
    }
    
    const result = await pool.query(
      'SELECT * FROM promo_codes WHERE code = $1 AND is_active = true',
      [code.toUpperCase()]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        valid: false, 
        error: 'Invalid or expired promo code' 
      });
    }
    
    const promo = result.rows[0];
    let discount = 0;
    
    if (promo.discount_type === 'percentage') {
      discount = (subtotal * promo.discount_value) / 100;
    } else {
      discount = promo.discount_value;
    }
    
    res.json({
      valid: true,
      discount_type: promo.discount_type,
      discount_value: promo.discount_value,
      discount: discount
    });
    
  } catch (error) {
    console.error('Error validating promo code:', error);
    res.status(500).json({ error: 'Failed to validate promo code' });
  }
};

