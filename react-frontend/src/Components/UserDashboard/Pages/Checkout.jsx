import React, { useState, useEffect } from "react";
import "./Checkout.css"; // Styling for the component
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    paymentMethod: "credit_card",
  });
  const [cartItems, setCartItems] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const navigate = useNavigate()

  // Fetch cart data from the backend
  useEffect(() => {
    const fetchCartData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://127.0.0.1:8000/api/carts", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCartItems(data.items || []);
          calculateGrandTotal(data.items || []);
        } else {
          console.error("Failed to fetch cart data");
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };

    fetchCartData();
  }, []);

  // Calculate grand total
  const calculateGrandTotal = (items) => {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setGrandTotal(total);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Submit the order
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
        const response = await fetch("http://127.0.0.1:8000/api/clear", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      
        if (response.ok) {
          alert("Order placed successfully!");
          
          // Clear the cart state
          setCartItems([]);
          setGrandTotal(0);
      
          // Navigate to the dashboard
          navigate("/"); // Replace "/dashboard" with the actual path to your dashboard
        } else {
          console.error("Failed to clear the cart.");
        }
      } catch (error) {
        console.error("Error clearing the cart:", error);
      }
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <div className="checkout-details">
        <div className="cart-summary">
          <h3>Order Summary</h3>
          <table className="order-summary-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Unit Price</th>
                <th>Quantity</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
                {cartItems.map((item) => {
                    // Ensure price is a number, fallback to 0 if not
                    const unitPrice = Number(item.price) || 0; 
                    const totalPrice = unitPrice * item.quantity;

                    return (
                    <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>${unitPrice.toFixed(2)}</td>
                        <td>{item.quantity}</td>
                        <td>${totalPrice.toFixed(2)}</td>
                    </tr>
                    );
                })}
                </tbody>
          </table>
          <h4>Grand Total: ${grandTotal.toFixed(2)}</h4>
        </div>
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h3>Billing Details</h3>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Address:
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
            ></textarea>
          </label>
          <label>
            Payment Method:
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
            >
              <option value="credit_card">Credit Card</option>
              <option value="paypal">PayPal/GCash</option>
              <option value="cash_on_delivery">Cash on Delivery</option>
            </select>
          </label>
          <button 
          type="submit" 
          className="place-order-btn">
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
