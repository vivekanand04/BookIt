import { Request, Response } from 'express';
import pool from '../config/database';

export const getAllExperiences = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    
    let query = 'SELECT * FROM experiences';
    let params: any[] = [];
    
    if (search && typeof search === 'string') {
      query += ' WHERE title ILIKE $1 OR location ILIKE $1 OR description ILIKE $1';
      params.push(`%${search}%`);
    }
    
    query += ' ORDER BY id';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching experiences:', error);
    res.status(500).json({ error: 'Failed to fetch experiences' });
  }
};

export const getExperienceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Get experience details
    const experienceResult = await pool.query(
      'SELECT * FROM experiences WHERE id = $1',
      [id]
    );
    
    if (experienceResult.rows.length === 0) {
      return res.status(404).json({ error: 'Experience not found' });
    }
    
    // Get available slots
    const slotsResult = await pool.query(
      `SELECT id, date, time, available_seats, total_seats
       FROM slots
       WHERE experience_id = $1 AND date >= CURRENT_DATE
       ORDER BY date, time`,
      [id]
    );
    
    const experience = experienceResult.rows[0];
    const slots = slotsResult.rows;
    
    res.json({
      ...experience,
      slots
    });
  } catch (error) {
    console.error('Error fetching experience details:', error);
    res.status(500).json({ error: 'Failed to fetch experience details' });
  }
};

