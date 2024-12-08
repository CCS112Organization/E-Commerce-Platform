import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './Pages/Home';
import User from './Pages/User';
import ViewCart from './Pages/ViewCart';
import Checkout from './Pages/Checkout';
import Navbar from './Navbar';
import { useState, useEffect } from 'react';

function Dashboard() {
  const [cartQuantity, setCartQuantity] = useState(0);

  const fetchCartQuantity = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/carts", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          const distinctProductIds = new Set(data.items.map(item => item.product_id));
          setCartQuantity(distinctProductIds.size);
        } else {
          console.error("Failed to fetch cart data");
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    }
  };

  // Initial fetch for cart quantity when the page loads
  useEffect(() => {
    fetchCartQuantity();
  }, []);

  return (
    <>
      <Navbar cartQuantity={cartQuantity} fetchCartQuantity={fetchCartQuantity} />
      <Routes>
        <Route path="/" element={<Home fetchCartQuantity={fetchCartQuantity} />} />
        <Route path="/profile" element={<User />} />
        <Route path="/view-cart" element={<ViewCart />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </>
  );
}

export default Dashboard;
