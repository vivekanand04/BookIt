import pool from './config/database';
import { readFileSync } from 'fs';
import { join } from 'path';

async function seed() {
  const client = await pool.connect();
  
  try {
    console.log('Starting database seeding...');
    
    // Create tables
    const schema = readFileSync(join(__dirname, 'config', 'schema.sql'), 'utf-8');
    await client.query(schema);
    console.log('✓ Tables created');

    // Clear existing data
    await client.query('TRUNCATE experiences, slots, bookings, promo_codes RESTART IDENTITY CASCADE');
    console.log('✓ Existing data cleared');

    // Insert experiences
    const experiencesData = [
      {
        title: 'Kayaking',
        description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
        location: 'Udupi',
        price: 999,
        image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
        about: 'Scenic routes, trained guides, and safety briefing. Minimum age 10. Helmet and Life jackets along with an expert will accompany in kayaking.'
      },
      {
        title: 'Nandi Hills Sunrise',
        description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
        location: 'Bangalore',
        price: 899,
        image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        about: 'Early morning trek to catch the breathtaking sunrise from Nandi Hills. Includes transportation and breakfast.'
      },
      {
        title: 'Coffee Trail',
        description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
        location: 'Coorg',
        price: 1299,
        image_url: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800',
        about: 'Explore the coffee plantations of Coorg with an expert guide. Learn about coffee cultivation and processing.'
      },
      {
        title: 'Kayaking',
        description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
        location: 'Udupi, Karnataka',
        price: 999,
        image_url: 'https://images.unsplash.com/photo-1503803548695-c2a7b4a5b875?w=800',
        about: 'Navigate through serene backwaters with experienced guides. Perfect for beginners and experts alike.'
      },
      {
        title: 'Boat Cruise',
        description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
        location: 'Sunderban',
        price: 999,
        image_url: 'https://images.unsplash.com/photo-1544551763-92ab472180f5?w=800',
        about: 'Enjoy a relaxing boat cruise through the Sunderbans mangrove forest with wildlife spotting opportunities.'
      },
      {
        title: 'Bunjee Jumping',
        description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
        location: 'Manali',
        price: 999,
        image_url: 'https://images.unsplash.com/photo-1515023115689-589c33041d3c?w=800',
        about: 'Experience the ultimate adrenaline rush with a bunjee jump from a height of 150 feet in Manali.'
      },
      {
        title: 'Coffee Trail',
        description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
        location: 'Coorg',
        price: 1299,
        image_url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800',
        about: 'Walk through lush green coffee estates and learn about the journey from bean to cup.'
      },
      {
        title: 'Kayaking',
        description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
        location: 'Udupi, Karnataka',
        price: 999,
        image_url: 'https://images.unsplash.com/photo-1542296332-2e4473faf563?w=800',
        about: 'Paddle through calm waters surrounded by mangroves and natural beauty.'
      }
    ];

    for (const exp of experiencesData) {
      await client.query(
        `INSERT INTO experiences (title, description, location, price, image_url, about)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [exp.title, exp.description, exp.location, exp.price, exp.image_url, exp.about]
      );
    }
    console.log('✓ Experiences inserted');

    // Insert slots for next 7 days
    const experiences = await client.query('SELECT id FROM experiences');
    const today = new Date();
    
    for (const exp of experiences.rows) {
      for (let i = 0; i < 7; i++) {
        const slotDate = new Date(today);
        slotDate.setDate(today.getDate() + i);
        const dateStr = slotDate.toISOString().split('T')[0];
        
        const times = [
          { time: '07:00 am', seats: 4 },
          { time: '09:00 am', seats: 2 },
          { time: '11:00 am', seats: 5 },
          { time: '01:00 pm', seats: 0 } // sold out
        ];
        
        for (const t of times) {
          await client.query(
            `INSERT INTO slots (experience_id, date, time, available_seats, total_seats)
             VALUES ($1, $2, $3, $4, $5)`,
            [exp.id, dateStr, t.time, t.seats, 10]
          );
        }
      }
    }
    console.log('✓ Slots inserted');

    // Insert promo codes
    const promoCodes = [
      { code: 'SAVE10', discount_type: 'percentage', discount_value: 10 },
      { code: 'FLAT100', discount_type: 'flat', discount_value: 100 },
      { code: 'SAVE20', discount_type: 'percentage', discount_value: 20 },
      { code: 'FLAT50', discount_type: 'flat', discount_value: 50 }
    ];

    for (const promo of promoCodes) {
      await client.query(
        `INSERT INTO promo_codes (code, discount_type, discount_value, is_active)
         VALUES ($1, $2, $3, true)`,
        [promo.code, promo.discount_type, promo.discount_value]
      );
    }
    console.log('✓ Promo codes inserted');

    console.log('\n✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seed();

