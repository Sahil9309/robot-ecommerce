import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Cart({ cart, removeFromCart }) {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const calculateTotal = () => {
      return cart.reduce((sum, item) => sum + item.price, 0);
    };
    setTotal(calculateTotal());
  }, [cart]);

  return (
    <div className="fixed right-0 top-20 bg-white p-6 shadow-xl rounded-l-2xl border border-gray-100 w-80">
      <h2 className="text-2xl font-bold text-blue-900 mb-4">Cart</h2>
      {cart.length === 0 ? (
        <p className="text-gray-600">Your cart is empty</p>
      ) : (
        <>
          <div className="space-y-4 mb-4">
            {cart.map((item) => (
              <div key={item._id} className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-600">${item.price}</p>
                </div>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between mb-4">
              <span className="font-bold">Total:</span>
              <span className="font-bold">${total}</span>
            </div>
            <Link
              to="/checkout"
              className="block w-full bg-blue-900 text-white text-center py-2 rounded-xl hover:bg-blue-800"
            >
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
}