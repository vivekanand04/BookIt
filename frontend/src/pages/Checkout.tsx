import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { bookingApi } from '../services/api';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { experience, slot, quantity, subtotal } = location.state || {};

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    promoCode: '',
    agreedToTerms: false,
  });

  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState('');

  if (!experience || !slot) {
    navigate('/');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleApplyPromo = async () => {
    if (!formData.promoCode.trim()) {
      setPromoError('Please enter a promo code');
      return;
    }

    try {
      setPromoLoading(true);
      setPromoError('');
      const result = await bookingApi.validatePromo(formData.promoCode, subtotal);
      
      if (result.valid && result.discount) {
        setDiscount(result.discount);
        setPromoApplied(true);
        setPromoError('');
      } else {
        setPromoError(result.error || 'Invalid promo code');
        setDiscount(0);
        setPromoApplied(false);
      }
    } catch (error) {
      setPromoError('Failed to validate promo code');
      setDiscount(0);
      setPromoApplied(false);
    } finally {
      setPromoLoading(false);
    }
  };

  const finalSubtotal = subtotal - discount;
  const finalTaxes = Math.round(finalSubtotal * 0.06);
  const finalTotal = finalSubtotal + finalTaxes;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.agreedToTerms) {
      alert('Please agree to the terms and safety policy');
      return;
    }

    try {
      setLoading(true);
      const bookingData = {
        experience_id: experience.id,
        slot_id: slot.id,
        full_name: formData.fullName,
        email: formData.email,
        quantity,
        promo_code: promoApplied ? formData.promoCode : undefined,
      };

      const result = await bookingApi.create(bookingData);
      
      if (result.success) {
        navigate('/confirmation', {
          state: {
            booking: result.booking,
            experience,
            slot,
          }
        });
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showSearch={false} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Checkout
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr,1fr] gap-6 lg:items-start">
          {/* Left Section - Form */}
          <div className="bg-gray-100 rounded-lg p-5 lg:max-h-[280px]">
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Full Name and Email in Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Full name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Your name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-1.5 text-sm bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Your name"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-1.5 text-sm bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Promo Code */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Promo code
                </label>
                <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                  <input
                    type="text"
                    name="promoCode"
                    placeholder="Promo code"
                    value={formData.promoCode}
                    onChange={handleInputChange}
                    disabled={promoApplied}
                    className="flex-1 min-w-0 px-3 py-1.5 text-sm bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    disabled={promoLoading || promoApplied}
                    className={`px-4 py-1.5 rounded font-medium text-sm whitespace-nowrap flex-shrink-0 ${
                      promoApplied
                        ? 'bg-green-500 text-white'
                        : 'bg-black text-white hover:bg-gray-800'
                    }`}
                  >
                    {promoLoading ? 'Checking...' : promoApplied ? '✓ Applied' : 'Apply'}
                  </button>
                </div>
                {promoError && (
                  <p className="text-red-500 text-xs mt-1">{promoError}</p>
                )}
                {promoApplied && (
                  <p className="text-green-600 text-xs mt-1">
                    Promo code applied! You saved ₹{discount}
                  </p>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start pt-1">
                <input
                  type="checkbox"
                  name="agreedToTerms"
                  checked={formData.agreedToTerms}
                  onChange={handleInputChange}
                  className="mt-0.5 h-3.5 w-3.5 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label className="ml-2 text-xs text-gray-700">
                  I agree to the terms and safety policy
                </label>
              </div>
            </form>
          </div>

          {/* Right Section - Summary */}
          <div className="bg-gray-100 rounded-lg p-5 lg:min-h-[320px]">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 text-xs">Experience</span>
                <span className="font-medium text-xs text-right">{experience.title}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600 text-xs">Date</span>
                <span className="font-medium text-xs">{formatDate(slot.date)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600 text-xs">Time</span>
                <span className="font-medium text-xs">{slot.time}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600 text-xs">Qty</span>
                <span className="font-medium text-xs">{quantity}</span>
              </div>

              <hr className="border-gray-300 my-2" />

              <div className="flex justify-between">
                <span className="text-gray-600 text-xs">Subtotal</span>
                <span className="font-medium text-xs">₹{subtotal}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span className="text-xs">Discount</span>
                  <span className="font-medium text-xs">-₹{discount}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-600 text-xs">Taxes</span>
                <span className="font-medium text-xs">₹{finalTaxes}</span>
              </div>

              <hr className="border-gray-300 my-2" />

              <div className="flex justify-between">
                <span className="text-sm font-semibold">Total</span>
                <span className="text-base font-bold">₹{finalTotal}</span>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading || !formData.agreedToTerms}
                className={`w-full py-2.5 rounded font-medium transition-colors text-sm mt-4 ${
                  loading || !formData.agreedToTerms
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-primary hover:bg-primary-dark text-black'
                }`}
              >
                {loading ? 'Processing...' : 'Pay and Confirm'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

