import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';
import { Experience, Slot } from '../types';
import { experienceApi } from '../services/api';

export default function Details() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      fetchExperience(parseInt(id));
    }
  }, [id]);

  const fetchExperience = async (experienceId: number) => {
    try {
      setLoading(true);
      const data = await experienceApi.getById(experienceId);
      setExperience(data);
      
      // Set default date to first available date
      if (data.slots && data.slots.length > 0) {
        const firstDate = data.slots[0].date;
        setSelectedDate(firstDate);
      }
    } catch (error) {
      console.error('Error fetching experience:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAvailableDates = (): string[] => {
    if (!experience?.slots) return [];
    const dates = [...new Set(experience.slots.map(slot => slot.date))];
    return dates;
  };

  const getTimeSlotsForDate = (date: string): Slot[] => {
    if (!experience?.slots) return [];
    return experience.slots.filter(slot => slot.date === date);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const day = date.getDate();
    return `${month} ${day}`;
  };

  const calculateTotal = () => {
    if (!experience) return { subtotal: 0, taxes: 0, total: 0 };
    const subtotal = experience.price * quantity;
    const taxes = Math.round(subtotal * 0.06);
    const total = subtotal + taxes;
    return { subtotal, taxes, total };
  };

  const handleConfirm = () => {
    if (!selectedSlot) {
      alert('Please select a time slot');
      return;
    }

    navigate('/checkout', {
      state: {
        experience,
        slot: selectedSlot,
        quantity,
        ...calculateTotal()
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header showSearch={false} />
        <LoadingSpinner />
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header showSearch={false} />
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Experience not found</p>
        </div>
      </div>
    );
  }

  const { subtotal, taxes, total } = calculateTotal();
  const availableDates = getAvailableDates();
  const timeSlots = getTimeSlotsForDate(selectedDate);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showSearch={false} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Details
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section - Details */}
          <div className="lg:col-span-2">
            {/* Image */}
            <div className="card mb-6">
              <img
                src={experience.image_url}
                alt={experience.title}
                className="w-full h-80 object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800';
                }}
              />
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{experience.title}</h1>
            <p className="text-gray-600 mb-6">{experience.description}</p>

            {/* Choose Date */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Choose date</h2>
              <div className="flex flex-wrap gap-3">
                {availableDates.map((date) => (
                  <button
                    key={date}
                    onClick={() => {
                      setSelectedDate(date);
                      setSelectedSlot(null);
                    }}
                    className={`px-4 py-2 rounded border ${
                      selectedDate === date
                        ? 'bg-primary border-primary text-black font-medium'
                        : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {formatDate(date)}
                  </button>
                ))}
              </div>
            </div>

            {/* Choose Time */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Choose time</h2>
              <div className="flex flex-wrap gap-3">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => slot.available_seats > 0 && setSelectedSlot(slot)}
                    disabled={slot.available_seats === 0}
                    className={`px-4 py-2 rounded border relative ${
                      selectedSlot?.id === slot.id
                        ? 'bg-primary border-primary text-black font-medium'
                        : slot.available_seats === 0
                        ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                        : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {slot.time}
                    {slot.available_seats > 0 && slot.available_seats < 5 && (
                      <span className="ml-2 text-xs text-red-500">{slot.available_seats} left</span>
                    )}
                    {slot.available_seats === 0 && (
                      <span className="ml-2 text-xs">Sold out</span>
                    )}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">All times are in IST (GMT +5:30)</p>
            </div>

            {/* About */}
            {experience.about && (
              <div>
                <h2 className="text-lg font-semibold mb-3">About</h2>
                <div className="bg-gray-100 p-4 rounded">
                  <p className="text-gray-700 text-sm">{experience.about}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Section - Booking Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Starts at</span>
                  <span className="text-xl font-bold">₹{experience.price}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Quantity</span>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                    >
                      −
                    </button>
                    <span className="text-lg font-medium w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                <hr className="border-gray-200" />

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{subtotal}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Taxes</span>
                  <span className="font-medium">₹{taxes}</span>
                </div>

                <hr className="border-gray-200" />

                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-xl font-bold">₹{total}</span>
                </div>

                <button
                  onClick={handleConfirm}
                  disabled={!selectedSlot}
                  className={`w-full py-3 rounded font-medium transition-colors ${
                    selectedSlot
                      ? 'bg-primary hover:bg-primary-dark text-black'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

