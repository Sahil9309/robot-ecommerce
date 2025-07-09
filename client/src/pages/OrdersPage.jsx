import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get("/api/orders");
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to load orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-8">
          My Orders
        </h1>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No orders found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                  <div className="space-y-1">
                    <p className="text-xs sm:text-sm text-gray-500">
                      Order ID: <span className="font-mono">{order._id}</span>
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Date: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-1">
                    <p className="text-base sm:text-lg font-bold text-blue-600">
                      Total: ${order.totalAmount}
                    </p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm ${
                        order.paymentStatus === "paid"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.paymentStatus === "paid"
                        ? "Paid"
                        : "Payment Pending"}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">
                    Delivery Details
                  </h3>
                  <div className="space-y-1 text-sm sm:text-base">
                    <p className="text-gray-600">{order.customerInfo.name}</p>
                    <p className="text-gray-600 break-words">
                      {order.customerInfo.address}
                    </p>
                    <p className="text-gray-600">{order.customerInfo.phone}</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 mt-4 pt-4">
                  <h3 className="font-medium text-gray-900 mb-4">Items</h3>
                  <div className="grid gap-4">
                    {order.items.map((item) => (
                      <div key={item._id} className="flex gap-4 items-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-grow">
                          <p className="font-medium text-gray-900">
                            {item.name}
                          </p>
                          <div className="flex justify-between items-center mt-1">
                            <div className="text-gray-600">
                              <span className="font-medium">${item.price}</span>
                              <span className="mx-2">×</span>
                              <span className="bg-gray-100 px-2 py-1 rounded text-sm">
                                Qty: {item.quantity}
                              </span>
                            </div>
                            <p className="font-medium text-blue-600">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <p className="text-gray-600">Total Items:</p>
                      <p className="font-medium">
                        {order.items.reduce(
                          (sum, item) => sum + item.quantity,
                          0,
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
