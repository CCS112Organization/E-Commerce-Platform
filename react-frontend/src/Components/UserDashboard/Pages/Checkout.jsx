import React, { useState, useEffect } from "react";
import "./Checkout.css";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";

const Checkout = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact_info: "",
    address: "",
    paymentMethod: "credit_card",
  });
  const [cartItems, setCartItems] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);  
  const navigate = useNavigate();

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
          toast.success(successMessage, { duration: 3000 });
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
        toast.success(errorMessage, { duration: 3000 });
      }
    };

    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://127.0.0.1:8000/api/user", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const user = await response.json();
          setFormData({
            name: user.name || "",
            email: user.email || "",
            contact_info: user.contact_info || "",
            address: user.address || "",
            paymentMethod: formData.paymentMethod,
          });
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchCartData();
    fetchUserData();
  }, []);

  const calculateGrandTotal = (items) => {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setGrandTotal(total);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

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
        setSuccessMessage("Order placed successfully!");  
        setGrandTotal(0);
  
        setTimeout(() => {
          setCartItems([]); 
          navigate("/"); 
        }, 2000);
      } else {
        setErrorMessage("Failed to clear the cart."); 
      }
    } catch (error) {
      setErrorMessage("Error clearing the cart: " + error.message);
    }
  };
  

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage, { duration: 3000 });
      setSuccessMessage(null);
    }

    if (errorMessage) {
      toast.error(errorMessage, { duration: 2000 });
      setErrorMessage(null);
    }
  }, [successMessage, errorMessage]);

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
                const unitPrice = Number(item.price) || 0;
                const totalPrice = unitPrice * item.quantity;

                return (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>₱{unitPrice.toFixed(2)}</td>
                    <td>{item.quantity}</td>
                    <td>₱{totalPrice.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <h4>Grand Total: ₱{grandTotal.toFixed(2)}</h4>
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
            Contact Info:
            <input
              type="text"
              name="contact_info"
              value={formData.contact_info}
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
          <button type="submit" className="place-order-btn">
            Place Order
          </button>
        </form>
      </div>
      <Toaster richColors position="bottom-right" />
    </div>
  );
};

export default Checkout;
