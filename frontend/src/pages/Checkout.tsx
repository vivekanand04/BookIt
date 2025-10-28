import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { bookingApi } from '../services/api';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { experience, slot, quantity, subtotal, taxes, total } = location.state || {};

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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Section - Form */}
          <div className="card p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full name
                </label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Your name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Your name"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                />
              </div>

              {/* Promo Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promo code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="promoCode"
                    placeholder="Promo code"
                    value={formData.promoCode}
                    onChange={handleInputChange}
                    disabled={promoApplied}
                    className="input-field flex-1"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    disabled={promoLoading || promoApplied}
                    className={`px-6 py-2.5 rounded font-medium ${
                      promoApplied
                        ? 'bg-green-500 text-white'
                        : 'bg-black text-white hover:bg-gray-800'
                    }`}
                  >
                    {promoLoading ? 'Checking...' : promoApplied ? '✓ Applied' : 'Apply'}
                  </button>
                </div>
                {promoError && (
                  <p className="text-red-500 text-sm mt-1">{promoError}</p>
                )}
                {promoApplied && (
                  <p className="text-green-600 text-sm mt-1">
                    Promo code applied! You saved ₹{discount}
                  </p>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  name="agreedToTerms"
                  checked={formData.agreedToTerms}
                  onChange={handleInputChange}
                  className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-600">
                  I agree to the terms and safety policy
                </label>
              </div>
            </form>
          </div>

          {/* Right Section - Summary */}
          <div className="card p-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Experience</span>
                <span className="font-medium text-right">{experience.title}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Date</span>
                <span className="font-medium">{formatDate(slot.date)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Time</span>
                <span className="font-medium">{slot.time}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Qty</span>
                <span className="font-medium">{quantity}</span>
              </div>

              <hr className="border-gray-200" />

              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{subtotal}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span className="font-medium">-₹{discount}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-600">Taxes</span>
                <span className="font-medium">₹{finalTaxes}</span>
              </div>

              <hr className="border-gray-200" />

              <div className="flex justify-between">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-xl font-bold">₹{finalTotal}</span>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading || !formData.agreedToTerms}
                className={`w-full py-3 rounded font-medium transition-colors ${
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

