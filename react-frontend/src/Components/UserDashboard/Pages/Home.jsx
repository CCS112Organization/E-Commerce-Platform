import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import { FaRegEye, FaCartPlus, FaTshirt, FaHeart, FaHome, FaAppleAlt, FaBabyCarriage, FaBasketballBall, FaCar, FaBook, FaPaw, FaCouch, FaTv } from "react-icons/fa";
import GridLoader from "react-spinners/GridLoader";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner"; 
import Navbar from "../Navbar"; 
import "./Home.css";

const API_URL = "http://127.0.0.1:8000/api/catalog";
const API_URL2 = "http://127.0.0.1:8000/api/carts";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  const categoryIcons = {
    "Electronics": <FaTv size={50} />,
    "Fashion": <FaTshirt size={50} />,
    "Health & Beauty": <FaHeart size={50} />,
    "Home & Living": <FaCouch size={50} />,
    "Groceries & Food": <FaAppleAlt size={50} />,
    "Toys & Baby": <FaBabyCarriage size={50} />,
    "Sports & Outdoors": <FaBasketballBall size={50} />,
    "Automotive": <FaCar size={50} />,
    "Books, Music & Movies": <FaBook size={50} />,
    "Pets & Animals": <FaPaw size={50} />,
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      fetchProducts();
    }
  }, [navigate]);

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

  useEffect(() => {
    filterProducts();
  }, [searchTerm, categoryFilter]);

  const fetchProducts = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Failed to fetch products.");
        return;
      }

      const data = await response.json();
      setProducts(data);
      setFilteredData(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setErrorMessage("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let data = [...products];

    if (searchTerm) {
      data = data.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== "All") {
      data = data.filter((product) => product.category === categoryFilter);
    }

    setFilteredData(data);
  };

  const handleAddToCart = async (productId) => {
    try {
      setErrorMessage(null);
      setSuccessMessage(null);
  
      const token = localStorage.getItem("token");
  
      if (!token) {
        throw new Error("Unauthorized.");
      }
  
      const payload = {
        product_id: productId,
        quantity: 1,
      };
  
      const response = await fetch(API_URL2, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        try {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to add product to cart.");
        } catch (jsonError) {
          throw new Error("Failed to add product to cart.");
        }
      }
  
      const data = await response.json();
      setSuccessMessage(data.message || "Product added to cart successfully!");
      console.log(`Product ${productId} added to cart`);
    } catch (error) {
      console.error("Error adding product to cart:", error);
      setErrorMessage(error.message || "Failed to add product to cart.");
    }
  };

  const handleViewProduct = (productId) => {
    console.log(`View details of product ${productId}`);
    navigate(`/product/${productId}`);
  };

  return (
    <>
      <Navbar setSearchTerm={setSearchTerm} /> 
      
      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "100vh" }}
        >
          <GridLoader color="#308fff" cssOverride={{ margin: "auto" }} size={35} />
        </div>
      ) : (
        <div className="container">
          <br />
          <h2>Product Catalog</h2>
          <br />
          <Row className="mt-4">
            {filteredData.map((product) => (
              <Col key={product.id} md={4} className="mb-4">
                <Card>
                  <Card.Body className="text-center">
                    <div style={{ fontSize: "60px", color: "#0c928b" }}>
                      {categoryIcons[product.category] || <FaHome size={50} />}
                    </div>
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Text>
                      <strong>Category:</strong> {product.category}
                    </Card.Text>
                    <Card.Text>
                      <strong>Price:</strong> ${product.price}
                    </Card.Text>
                    <Card.Text>
                      <strong>Quantity:</strong> {product.quantity} pieces
                    </Card.Text>
                    <div className="d-flex justify-content-between mt-3">
                      <Button
                        variant="primary"
                        onClick={() => handleAddToCart(product.id)}
                        className="w-45"
                      >
                        <FaCartPlus /> Add to Cart
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => handleViewProduct(product.id)}
                        className="w-45"
                      >
                        <FaRegEye /> View
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}

      <Toaster richColors position="bottom-right" />
    </>
  );
};

export default Home;