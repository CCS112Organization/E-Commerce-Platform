import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { toast, Toaster } from "sonner";
import "./ViewCart.css";

const ViewCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);

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

  const calculateGrandTotal = (items) => {
    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setGrandTotal(total);
  };

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

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      toast.error("You must be logged in to proceed.", {
        position: "bottom-right",
        style: { backgroundColor: "red", color: "white" },
      });
      navigate("/login");
      return;
    }
  
    try {
      // Fetch the product catalog from the API
      const catalogResponse = await fetch("http://127.0.0.1:8000/api/catalog", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!catalogResponse.ok) {
        toast.error("Error fetching catalog. Please try again later.", {
          position: "bottom-right",
          style: { backgroundColor: "red", color: "white" },
        });
        return;
      }
  
      const catalog = await catalogResponse.json(); 
  
      for (const item of cartItems) {
        const product = catalog.find((prod) => prod.id === item.product_id);
  
        if (!product) {
          toast.error(`Product with ID ${item.product_id} not found in catalog.`, {
            position: "bottom-right",
            style: { backgroundColor: "red", color: "white" },
          });
          return;
        }
  
        const availableStock = product.quantity;

        if (availableStock === 0) {
          toast.error(`The item "${item.name}" is out of stock.`, {
            position: "bottom-right",
            style: { backgroundColor: "red", color: "white" },
          });
          return;
      }

        if (item.quantity > availableStock) {
          toast.error(`The quantity of "${item.name}" exceeds the available stock. Only ${availableStock} units are available.`, {
            position: "bottom-right",
            style: { backgroundColor: "red", color: "white" },
          });
          return;
        } 
    }
      if (cartItems.length === 0) {
        toast.error("Your cart is empty.", {
          position: "bottom-right",
          style: { backgroundColor: "red", color: "white" },
        });
        navigate("/");
      } else {
        navigate("/user/checkout");
      }
  
    } catch (error) {
      toast.error("An error occurred while processing your checkout. Please try again later.", {
        position: "bottom-right",
        style: { backgroundColor: "red", color: "white" },
      });
      console.error("Checkout error:", error);
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
                  <p>{item.name}</p>
                  <p>Unit Price: ₱{item.price}</p>
                  <p>Total Price: ₱{(item.price * item.quantity).toFixed(2)}</p>
                  <div className="quantity-controls">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
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
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
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
                  <MdDelete />
                </button>
              </div>
            ))}
          </div>
          <div className="cart-total">
            <h3> Total: ₱{grandTotal.toFixed(2)}</h3>
          </div>
          <button className="checkout-btn" onClick={handleCheckout}>
            Checkout
          </button>
        </>
      ) : (
        <p>Your cart is empty!</p>
      )}
      <Toaster richColor position="bottom-right" />
    </div>
  );
};

export default ViewCart;
