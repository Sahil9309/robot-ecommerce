import { useCart } from '../context/CartContext';
import { useState, useContext } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate, Navigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const { cartItems, removeFromCart, getCartTotal, clearCart, updateQuantity } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: ''
  });

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleOnlinePayment = async () => {
    if (!formData.name || !formData.address || !formData.phone) {
      toast.error('Please fill in all delivery details');
      return;
    }

    setIsProcessing(true);
    const toastId = toast.loading('Processing payment...');

    try {
      const response = await axios.post('/api/orders', {
        items: cartItems,
        customerInfo: formData,
        paymentMethod: 'online',
        paymentStatus: 'paid',
        totalAmount: getCartTotal()
      });

      if (response.data.success) {
        toast.success('Payment successful!', {
          id: toastId,
        });
        clearCart();
        navigate('/payment-success');
      }
    } catch (err) {
      toast.error('Payment failed. Please try again.', {
        id: toastId,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCashOnDelivery = async () => {
    if (!formData.name || !formData.address || !formData.phone) {
      alert('Please fill in all delivery details');
      return;
    }

    try {
      const response = await axios.post('/api/orders', {
        items: cartItems,
        customerInfo: formData,
        paymentMethod: 'cod',
        paymentStatus: 'pending',
        totalAmount: getCartTotal()
      });

      if (response.data.success) {
        alert('Order placed successfully!');
        clearCart();
        navigate('/orders');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items Section */}
          <div className="flex-grow lg:w-2/3">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Shopping Cart ({cartItems.length})
              </h1>

              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="mb-6"
                  >
                    <svg className="w-32 h-32 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </motion.div>
                  <h3 className="text-2xl font-medium text-gray-900 mb-2">Your cart is empty</h3>
                  <p className="text-gray-500 mb-6">Looks like you haven't added any robots yet.</p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700"
                    onClick={() => window.location.href = '/products'}
                  >
                    Continue Shopping
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-6">
                  {cartItems.map((item, index) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full sm:w-40 h-40 object-cover rounded-lg"
                      />
                      <div className="flex-grow space-y-2 w-full">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                          <p className="text-2xl font-bold text-blue-600">
                            ${(parseFloat(item.price) * parseInt(item.quantity)).toFixed(2)}
                          </p>
                        </div>
                        <p className="text-gray-600 text-sm">{item.description}</p>
                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              className="bg-gray-200 hover:bg-gray-300 rounded-lg p-2 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            </motion.button>
                            <span className="w-8 text-center font-semibold">{item.quantity}</span>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              className="bg-gray-200 hover:bg-gray-300 rounded-lg p-2 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </motion.button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Remove
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Section */}
          {cartItems.length > 0 && (
            <div className="lg:w-1/3">
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-base text-gray-600">
                    <span>Subtotal</span>
                    <span>${getCartTotal()}</span>
                  </div>
                  <div className="flex justify-between text-base text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span className="text-blue-600">${getCartTotal()}</span>
                    </div>
                  </div>
                </div>

                <form className="space-y-6">
                  <div className="space-y-4">
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                    <textarea
                      name="address"
                      placeholder="Delivery Address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      type="button"
                      onClick={handleOnlinePayment}
                      disabled={isProcessing}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm hover:shadow-md flex items-center justify-center"
                    >
                      {isProcessing ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        'Pay Online'
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      type="button"
                      onClick={handleCashOnDelivery}
                      disabled={isProcessing}
                      className="w-full bg-gray-50 text-gray-900 py-4 rounded-xl font-medium hover:bg-gray-100 transition-all border border-gray-200"
                    >
                      Cash on Delivery
                    </motion.button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}