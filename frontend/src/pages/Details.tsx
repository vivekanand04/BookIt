import { useState, useEffect, useRef, RefObject } from 'react';
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
  const [isDescriptionExpanded, setDescriptionExpanded] = useState(false);
  const [isDateExpanded, setDateExpanded] = useState(false);
  const [isTimeExpanded, setTimeExpanded] = useState(false);
  const [isAboutExpanded, setAboutExpanded] = useState(false);
  const [showDescriptionToggle, setShowDescriptionToggle] = useState(false);
  const [showDateToggle, setShowDateToggle] = useState(false);
  const [showTimeToggle, setShowTimeToggle] = useState(false);
  const [showAboutToggle, setShowAboutToggle] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const dateContainerRef = useRef<HTMLDivElement>(null);
  const timeContainerRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLParagraphElement>(null);
  const [descriptionCollapsedHeight, setDescriptionCollapsedHeight] = useState(0);
  const [aboutCollapsedHeight, setAboutCollapsedHeight] = useState(0);
  const [dateCollapsedHeight, setDateCollapsedHeight] = useState(0);
  const [timeCollapsedHeight, setTimeCollapsedHeight] = useState(0);

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
      } else {
        // If no slots from backend, set first hardcoded date
        setSelectedDate('2024-10-22');
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

  const { subtotal, taxes, total } = calculateTotal();
  
  // HARDCODED DATA FOR TESTING - Remove this once backend is working
  const hardcodedDates = ['2024-10-22', '2024-10-23', '2024-10-24', '2024-10-25', '2024-10-26'];
  const hardcodedTimeSlots: Slot[] = [
    { id: 1, experience_id: 1, date: selectedDate, time: '07:00 am', available_seats: 4, total_seats: 10 },
    { id: 2, experience_id: 1, date: selectedDate, time: '9:00 am', available_seats: 2, total_seats: 10 },
    { id: 3, experience_id: 1, date: selectedDate, time: '11:00 am', available_seats: 5, total_seats: 10 },
    { id: 4, experience_id: 1, date: selectedDate, time: '1:00 pm', available_seats: 0, total_seats: 10 },
  ];
  
  // Use real data if available, otherwise use hardcoded
  const availableDates = experience?.slots && experience.slots.length > 0 ? getAvailableDates() : hardcodedDates;
  const timeSlots = experience?.slots && experience.slots.length > 0 ? getTimeSlotsForDate(selectedDate) : hardcodedTimeSlots;
  
  // Debug: Check if data exists
  console.log('DEBUG - Experience:', experience);
  console.log('DEBUG - Available Dates:', availableDates);
  console.log('DEBUG - Selected Date:', selectedDate);
  console.log('DEBUG - Time Slots:', timeSlots);

  useEffect(() => {
    setDescriptionExpanded(false);
    setDateExpanded(false);
    setTimeExpanded(false);
    setAboutExpanded(false);
  }, [experience?.id]);

  useEffect(() => {
    if (!experience) {
      setShowDescriptionToggle(false);
      setShowDateToggle(false);
      setShowTimeToggle(false);
      setShowAboutToggle(false);
      return;
    }

    const parseLineHeight = (element: HTMLElement) => {
      const styles = window.getComputedStyle(element);
      const lineHeightValue = styles.lineHeight;
      if (lineHeightValue === 'normal') {
        const fontSize = parseFloat(styles.fontSize || '16');
        return fontSize ? fontSize * 1.4 : 0;
      }
      const parsed = parseFloat(lineHeightValue);
      return Number.isNaN(parsed) ? 0 : parsed;
    };

    const measureTextBlock = (
      ref: RefObject<HTMLElement>,
      maxLines: number,
      setCollapsedHeight: (value: number) => void,
      setToggle: (value: boolean) => void
    ) => {
      const element = ref.current;
      if (!element) {
        setCollapsedHeight(0);
        setToggle(false);
        return;
      }
      const lineHeight = parseLineHeight(element as HTMLElement);
      if (!lineHeight) {
        setCollapsedHeight(0);
        setToggle(false);
        return;
      }
      const collapsedHeight = lineHeight * maxLines;
      setCollapsedHeight(collapsedHeight);
      setToggle(element.scrollHeight > collapsedHeight + 1);
    };

    const measureFlexContainer = (
      ref: RefObject<HTMLDivElement>,
      visibleRows: number,
      setCollapsedHeight: (value: number) => void,
      setToggle: (value: boolean) => void
    ) => {
      const container = ref.current;
      if (!container) {
        setCollapsedHeight(0);
        setToggle(false);
        return;
      }
      const firstChild = container.firstElementChild as HTMLElement | null;
      if (!firstChild) {
        setCollapsedHeight(0);
        setToggle(false);
        return;
      }
      const styles = window.getComputedStyle(container);
      const gapValue = styles.rowGap || styles.gap || '0';
      const gap = parseFloat(gapValue) || 0;
      const rowHeight = firstChild.offsetHeight;
      if (!rowHeight) {
        setCollapsedHeight(0);
        setToggle(false);
        return;
      }
      const collapsedHeight = rowHeight * visibleRows + gap * (visibleRows - 1);
      setCollapsedHeight(collapsedHeight);
      setToggle(container.scrollHeight > collapsedHeight + 1);
    };

    const updateMeasurements = () => {
      measureTextBlock(descriptionRef, 2, setDescriptionCollapsedHeight, setShowDescriptionToggle);
      measureTextBlock(aboutRef, 2, setAboutCollapsedHeight, setShowAboutToggle);
    };

    const timeout = window.setTimeout(updateMeasurements, 0);
    const handleResize = () => {
      updateMeasurements();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener('resize', handleResize);
    };
  }, [experience]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showSearch={false} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
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

        <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
          {/* Left Section - Details */}
          <div>
            {/* Image */}
            <div className="card mb-6">
              <img
                src={experience.image_url}
                alt={experience.title}
                className="w-full object-cover rounded-lg sm:h-96 mobile-aspect-2-3"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800';
                }}
              />
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{experience.title}</h1>
            <div className="mb-6">
              <p
                ref={descriptionRef}
                className={`text-gray-600 transition-all ${!isDescriptionExpanded ? 'clamp-2' : ''}`}
                style={!isDescriptionExpanded && descriptionCollapsedHeight ? { maxHeight: `${descriptionCollapsedHeight}px` } : undefined}
              >
                {experience.description}
              </p>
              {showDescriptionToggle && (
                <button
                  type="button"
                  onClick={() => setDescriptionExpanded((prev) => !prev)}
                  aria-expanded={isDescriptionExpanded}
                  className="mt-2 text-sm font-medium text-red-500 hover:text-red-600 focus:outline-none"
                >
                  {isDescriptionExpanded ? 'Show Less' : 'Show More'}
                </button>
              )}
            </div>

            {/* Choose Date */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Choose date</h2>
              <div className="flex flex-wrap gap-3 min-h-[44px]">
                {availableDates.length > 0 ? (
                  availableDates.map((date) => (
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
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No available dates. Check console for debug info.</p>
                )}
              </div>
            </div>

            {/* Choose Time */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Choose time</h2>
              <div className="flex flex-wrap gap-3 min-h-[44px]">
                {!selectedDate ? (
                  <p className="text-sm text-gray-500">Please select a date first</p>
                ) : timeSlots.length > 0 ? (
                  timeSlots.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => slot.available_seats > 0 && setSelectedSlot(slot)}
                      disabled={slot.available_seats === 0}
                      className={`px-4 py-2 rounded border ${
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
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No time slots available. Check console for debug info.</p>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-2">All times are in IST (GMT +5:30)</p>
            </div>

            {/* About */}
            {experience.about && (
              <div>
                <h2 className="text-lg font-semibold mb-3">About</h2>
                <div className="bg-gray-100 p-4 rounded">
                  <p
                    ref={aboutRef}
                    className={`text-gray-700 text-sm transition-all ${!isAboutExpanded ? 'clamp-2' : ''}`}
                    style={!isAboutExpanded && aboutCollapsedHeight ? { maxHeight: `${aboutCollapsedHeight}px` } : undefined}
                  >
                    {experience.about}
                  </p>
                  {showAboutToggle && (
                    <button
                      type="button"
                      onClick={() => setAboutExpanded((prev) => !prev)}
                      aria-expanded={isAboutExpanded}
                      className="mt-3 text-sm font-medium text-red-500 hover:text-red-600 focus:outline-none"
                    >
                      {isAboutExpanded ? 'Show Less' : 'Show More'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Section - Booking Summary */}
          <div>
            <div className="bg-gray-100 rounded-lg p-4 sticky top-24 shadow-sm">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Starts at</span>
                  <span className="text-lg font-bold">₹{experience.price}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Quantity</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded bg-white hover:bg-gray-50 text-sm"
                    >
                      −
                    </button>
                    <span className="text-base font-medium w-6 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded bg-white hover:bg-gray-50 text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>

                <hr className="border-gray-300" />

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Subtotal</span>
                  <span className="font-medium text-sm">₹{subtotal}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Taxes</span>
                  <span className="font-medium text-sm">₹{taxes}</span>
                </div>

                <hr className="border-gray-300" />

                <div className="flex justify-between items-center">
                  <span className="text-base font-semibold">Total</span>
                  <span className="text-lg font-bold">₹{total}</span>
                </div>

                <button
                  onClick={handleConfirm}
                  disabled={!selectedSlot}
                  className={`w-full py-2.5 rounded font-medium transition-colors text-sm ${
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

