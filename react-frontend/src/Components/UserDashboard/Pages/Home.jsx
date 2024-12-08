import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button, Dropdown, Modal } from "react-bootstrap";
import {
  FaRegEye,
  FaCartPlus,
  FaTshirt,
  FaHeart,
  FaHome,
  FaAppleAlt,
  FaBabyCarriage,
  FaBasketballBall,
  FaCar,
  FaBook,
  FaPaw,
  FaCouch,
  FaTv,
} from "react-icons/fa";
import GridLoader from "react-spinners/GridLoader";
import * as FaIcons from "react-icons/fa";
import * as IoIcons from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import "./Home.css";

const API_URL = "http://127.0.0.1:8000/api/catalog";
const API_URL2 = "http://127.0.0.1:8000/api/carts";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
      toast.success(successMessage, { duration: 2000 });
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
      const filteredData = data.filter((product) => product.quantity > 0); 
      setProducts(filteredData);
      setFilteredData(filteredData); 
  
    } catch (error) {
      console.error("Error fetching products:", error);
      setErrorMessage("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filterProducts = () => {
    let data = [...products];
  
    data = data.filter((product) => product.quantity > 0);
  
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
  
      const cartItemResponse = await fetch(API_URL2, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!cartItemResponse.ok) {
        throw new Error("Failed to fetch cart items.");
      }
  
      const cartItems = await cartItemResponse.json();
      console.log("Cart items:", cartItems);
  
      let existingItem = null;
      if (cartItems && cartItems.length > 0) {
        existingItem = cartItems.find((item) => item.product_id === productId);
      }
  
      if (existingItem) {
        console.log("Existing item:", existingItem);
        const updatedQuantity = existingItem.quantity + 1;
  
        const updateResponse = await fetch(`${API_URL2}/${existingItem.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quantity: updatedQuantity }),
        });
  
        if (!updateResponse.ok) {
          throw new Error("Failed to update product quantity.");
        }
  
        const updatedData = await updateResponse.json();
        setSuccessMessage(
          updatedData.message || "Product added to cart successfully!"
        );
        console.log(`Product ${productId} quantity updated in cart`);
      } else {
        const payload = {
          product_id: productId,
          quantity: 1,
        };
  
        const storeResponse = await fetch(`${API_URL2}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
  
        if (!storeResponse.ok) {
          const errorData = await storeResponse.json();
          throw new Error(
            errorData.message || "Failed to add product to cart."
          );
        }
  
        const data = await storeResponse.json();
        setSuccessMessage(
          data.message || "Product added to cart successfully!"
        );
        console.log(`Product ${productId} added to cart`);
      }

      setTimeout(() => {
        navigate("/"); 
      }, 2300);

    } catch (error) {
      console.error("Error adding product to cart:", error);
      setErrorMessage(error.message || "Failed to add product to cart.");
    }
  };
  

  const handleViewProduct = (product) => {
    setSelectedProduct(product); 
    setShowModal(true); 
  };

  const handleCloseModal = () => {
    setShowModal(false); 
    setSelectedProduct(null); 
  };

  return (
    <>
      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "100vh" }}
        >
          <GridLoader
            color="#308fff"
            cssOverride={{ margin: "auto" }}
            size={35}
          />
        </div>
      ) : (
        <div className="container">
          <br />
          <div className="d-flex justify-content-between align-items-center">
            <h2>Product Catalog</h2>

            <div className="d-flex align-items-center">

              <div className="search-container me-3">
                <FaIcons.FaSearch className="search-icon" />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>

              <Col xs="auto" className="ms-auto">
                <Dropdown>
                  <Dropdown.Toggle
                    variant="light"
                    className="d-flex align-items-center"
                  >
                    <i className="me-2">
                      <IoIcons.IoFilter />
                    </i>
                    Sort & Filter
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown drop="start">
                      <Dropdown.Toggle
                        variant="light"
                        as="div"
                        className="dropdown-item"
                      >
                        Category
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {[
                          "All",
                          "Electronics",
                          "Fashion",
                          "Health & Beauty",
                          "Home & Living",
                          "Groceries & Food",
                          "Toys & Baby",
                          "Sports & Outdoors",
                          "Automotive",
                          "Books, Music & Movies",
                          "Pets & Animals",
                        ].map((cat) => (
                          <Dropdown.Item
                            key={cat}
                            onClick={() => {
                              setCategoryFilter(cat);
                              filterProducts(searchTerm, cat);
                            }}
                          >
                            {cat}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>

                    <Dropdown.Divider />

                    <Dropdown drop="start">
                      <Dropdown.Toggle
                        variant="light"
                        as="div"
                        className="dropdown-item"
                      >
                        Price
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          onClick={() => {
                            const sortedData = [...filteredData].sort(
                              (a, b) => b.price - a.price
                            );
                            setFilteredData(sortedData);
                          }}
                        >
                          Highest Price
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => {
                            const sortedData = [...filteredData].sort(
                              (a, b) => a.price - b.price
                            );
                            setFilteredData(sortedData);
                          }}
                        >
                          Lowest Price
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>


                  </Dropdown.Menu>
                </Dropdown>
              </Col>
            </div>
          </div>
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
                      <strong>Price:</strong> ₱{product.price}
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
                        onClick={() => handleViewProduct(product)}
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
      {selectedProduct && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedProduct.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              <strong>Barcode:</strong> {selectedProduct.barcode}
            </p>
            <p>
              <strong>Description:</strong> {selectedProduct.description}
            </p>
            <p>
              <strong>Category:</strong> {selectedProduct.category}
            </p>
            <p>
              <strong>Quantity:</strong> {selectedProduct.quantity}
            </p>
            <p>
              <strong>Price:</strong> ₱{selectedProduct.price}
            </p>
          </Modal.Body>
          <Modal.Footer>
            
            <Button
              variant="primary"
              onClick={() => handleAddToCart(selectedProduct.id)} 
              className="w-45"
            >
              <FaCartPlus /> Add to Cart
            </Button>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      <Toaster richColors position="bottom-right" />
    </>
  );
};

export default Home;