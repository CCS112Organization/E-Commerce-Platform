import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ViewCart.css"; // Assuming you have a separate CSS file
import { Link } from "react-router-dom";

const ViewCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const navigate = useNavigate();

  // Fetch the cart data when the page loads
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
          setCartItems(data.items || []); // Make sure data contains items array
          calculateGrandTotal(data.items || []); // Calculate the grand total
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
    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setGrandTotal(total);
  };

  // Update item quantity in the cart
  const updateQuantity = async (id, newQuantity) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/carts/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quantity: newQuantity }),
        }
      );

      if (response.ok) {
        const updatedItems = cartItems.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        );
        setCartItems(updatedItems);
        calculateGrandTotal(updatedItems);
      } else {
        console.error("Failed to update quantity");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  // Remove item from the cart
  const removeItem = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/carts/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const updatedItems = cartItems.filter((item) => item.id !== id);
        setCartItems(updatedItems);
        calculateGrandTotal(updatedItems);
      } else {
        console.error("Failed to remove item");
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  // Handle checkout or redirect to home if cart is empty
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      navigate("/");
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div className="view-cart-container">
      <h2>Shopping Cart</h2>
      {cartItems.length > 0 ? (
        <>
          <div className="cart-items-list">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-info">
                  <p>{item.name}</p> {/* Updated to use 'name' from the API */}
                  <p>Unit Price: ${item.price}</p>
                  <p>Total Price: ${(item.price * item.quantity).toFixed(2)}</p>
                  <div className="quantity-controls">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1 ,)}
                    >
                      +
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      onChange={(e) =>
                        updateQuantity(item.id, parseInt(e.target.value))
                      }
                    />
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1,)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                  </div>
                </div>
                <button
                  className="remove-item-btn"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="cart-total">
            <h3> Total: ${grandTotal.toFixed(2)}</h3>
          </div>
          <button className="checkout-btn">
            <Link to="/user/checkout" style={{ textDecoration: "none", color: "inherit" }}>
              Checkout
            </Link>
          </button>
        </>
      ) : (
        <p>Your cart is empty!</p>
      )}
    </div>
  );
};

export default ViewCart;
