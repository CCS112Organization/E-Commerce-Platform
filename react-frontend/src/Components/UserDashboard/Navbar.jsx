import React, { useState, useEffect } from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { SidebarData } from "./SidebarData";
import { IconContext } from "react-icons";
import "./Navbar.css";

export const Navbar = () => {
  const [sidebar, setSidebar] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(0); // State to track cart quantity based on distinct products
  const showSidebar = () => setSidebar(!sidebar);
  const navigate = useNavigate();

  // Fetch cart quantity on component mount
  useEffect(() => {
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
            
            // Count distinct product IDs (by `product_id`)
            const distinctProductIds = new Set(data.items.map(item => item.product_id));
            setCartQuantity(distinctProductIds.size); // Set cart quantity to the number of distinct products
          } else {
            console.error("Failed to fetch cart data");
          }
        } catch (error) {
          console.error("Error fetching cart data:", error);
        }
      }
    };

    fetchCartQuantity();
  }, []); // Empty dependency array to run the effect only once when the component mounts

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };


  return (
    <>
      <IconContext.Provider value={{ color: "#fff" }}>
        <div className="navbar">
          <Link to="#" className="menu-bars">
            <FaIcons.FaBars onClick={showSidebar} />
          </Link>

          <Link to="/user/view-cart" className="view-cart">
            <div className="cart-icon-container">
              <FaIcons.FaShoppingCart />
              {cartQuantity > 0 && (
                <span className="cart-quantity-badge">{cartQuantity}</span>
              )}
            </div>
          </Link>
        </div>

        <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
          <ul className="nav-menu-items" onClick={showSidebar}>
            <li className="navbar-toggle">
              <Link to="#" className="menu-bars">
                <AiIcons.AiOutlineClose />
              </Link>
            </li>
            {SidebarData.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  {item.path === "/" ? (
                    <Link to={item.path} onClick={handleLogout}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  ) : (
                    <Link to={item.path}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
};

export default Navbar;
