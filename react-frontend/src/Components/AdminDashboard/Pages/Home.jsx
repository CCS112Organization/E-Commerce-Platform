import React, { useState, useEffect } from "react";
import {
  Table,
  Form,
  Button,
  Card,
  Modal,
  Row,
  Col,
  Dropdown,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import * as IoIcons from "react-icons/io5";
import GridLoader from "react-spinners/GridLoader";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Home.css";

// API Base URL
const API_URL = "http://127.0.0.1:8000/api/products";

function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [originalData, setOriginalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [priceFilter, setPriceFilter] = useState({ min: 0, max: 0 });
  const [stockFilter, setStockFilter] = useState(null);
  const [editedProduct, setEditedProduct] = useState({
    barcode: null,
    name: "",
    description: "",
    quantity: 0,
    price: 0,
    category: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      fetchProducts();
    }
  }, [navigate]);

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

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
      setOriginalData(data);
      setFilteredData(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setErrorMessage("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseEdit = () => setShowEditModal(false);
  const handleCloseDelete = () => setShowDeleteModal(false);

  const handleShowEdit = (product) => {
    setSelectedProduct(product);
    setEditedProduct(product);
    setShowEditModal(true);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProduct = async () => {
    setModalLoading(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_URL}/${editedProduct.barcode}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editedProduct),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const messages = Object.values(errorData.errors).flat().join(", ");
        setErrorMessage(messages || "An error occurred.");
        return;
      }

      setSuccessMessage("Product updated successfully!");
      fetchProducts();
      handleCloseEdit();
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleShowDelete = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const handleDeleteProduct = async () => {
    setModalLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/${selectedProduct.barcode}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        setErrorMessage("Failed to delete product.");
        return;
      }

      setSuccessMessage("Product deleted successfully!");
      fetchProducts();
      handleCloseDelete();
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term === "") {
      setFilteredData(originalData);
    } else {
      searchName(term, categoryFilter);
    }
  };

  const handlePriceFilter = () => {
    if (priceFilter.min >= priceFilter.max && priceFilter.max !== 0) {
      setErrorMessage("Minimum price should be smaller than maximum price.");
      return;
    }
    setErrorMessage(null); 
    searchName("", categoryFilter); 
    setPriceFilter({ min: 0, max: 0 });
    setTimeout(() => {
    }, 500);
  };

  const searchName = (name, category) => {
    let data = [...originalData];

    if (name) {
      data = data.filter((product) =>
        product.name.toLowerCase().includes(name.toLowerCase())
      );
    }

    if (category !== "All") {
      data = data.filter((product) => product.category === category);
    }

    if (priceFilter.min || priceFilter.max) {
      data = data.filter(
        (product) =>
          (priceFilter.min === 0 || product.price >= priceFilter.min) &&
          (priceFilter.max === 0 || product.price <= priceFilter.max)
      );
    }

    if (stockFilter) {
      data = data.filter((product) =>
        stockFilter === "inStock"
          ? product.quantity > 0
          : product.quantity === 0
      );
    }

    setFilteredData(data);
  };

  const isUpdateDisabled =
    !editedProduct.price ||
    editedProduct.price <= 0 ||
    !editedProduct.quantity ||
    editedProduct.quantity <= 0;

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
        <div className="container-dashboard">
          <Card>
            <Card.Header>
              <h1>Product Table</h1>
            </Card.Header>
            <Card.Body>
              {successMessage && (
                <div className={`message success`}>{successMessage}</div>
              )}
              {errorMessage && (
                <div className={`message error`}>{errorMessage}</div>
              )}
              {filteredData.length === 0 && (
                <div className="text-center">
                  <p>No products found.</p>
                </div>
              )}
              <Form>
                <Row className="align-items-center">
                  <Col xs="auto" className="d-flex align-items-center">
                    <Form.Label className="me-2 mb-0">Search</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter product name"
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="me-2"
                    />
                  </Col>

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
                            ].map((cat) => (
                              <Dropdown.Item
                                key={cat}
                                onClick={() => {
                                  setCategoryFilter(cat);
                                  searchName(searchTerm, cat);
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
                                const sortedData = [...originalData].sort(
                                  (a, b) => b.price - a.price
                                );
                                setFilteredData(sortedData);
                              }}
                            >
                              Highest Price
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => {
                                const sortedData = [...originalData].sort(
                                  (a, b) => a.price - b.price
                                );
                                setFilteredData(sortedData);
                              }}
                            >
                              Lowest Price
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>

                        <Dropdown.Divider />
                        <Dropdown drop="start">
                          <Dropdown.Toggle
                            variant="light"
                            as="div"
                            className="dropdown-item"
                          >
                            Stock
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item
                              onClick={() => {
                                const sortedData = [...originalData].sort(
                                  (a, b) => b.quantity - a.quantity
                                );
                                setFilteredData(sortedData);
                              }}
                            >
                              Highest Stock
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => {
                                const sortedData = [...originalData].sort(
                                  (a, b) => a.quantity - b.quantity
                                );
                                setFilteredData(sortedData);
                              }}
                            >
                              Lowest Stock
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Col>
                </Row>
              </Form>

              <div style={{ maxHeight: "335px", overflowY: "auto" }}>
                <Table striped bordered hover responsive="sm">
                  <thead>
                    <tr>
                      <th>Product ID</th>
                      <th>Product Name</th>
                      <th>Product Description</th>
                      <th>Stock</th>
                      <th>Price</th>
                      <th>Category</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((product) => (
                      <tr key={product.barcode}>
                        <td>{product.barcode}</td>
                        <td>{product.name}</td>
                        <td>{product.description}</td>
                        <td>{product.quantity}</td>
                        <td>{product.price}</td>
                        <td>{product.category}</td>
                        <td>
                          <Button
                            variant="warning"
                            size="sm"
                            className="edit-btn"
                            onClick={() => handleShowEdit(product)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            className="delete-btn"
                            onClick={() => handleShowDelete(product)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </div>
      )}
      <Modal
        show={showEditModal}
        onHide={handleCloseEdit}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="barcode">
                  <Form.Label>Barcode (UPC)</Form.Label>
                  <Form.Control
                    type="text"
                    name="barcode"
                    value={editedProduct.barcode}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="name">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={editedProduct.name}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="description">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={editedProduct.description}
                    onChange={handleInputChange}
                    placeholder="Enter product description"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="price">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={editedProduct.price}
                    onChange={handleInputChange}
                    placeholder="Enter price"
                    step="0.01"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="quantity">
                  <Form.Label>Stock</Form.Label>
                  <Form.Control
                    type="number"
                    name="quantity"
                    value={editedProduct.quantity}
                    onChange={handleInputChange}
                    placeholder="Enter quantity"
                    min="1"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="category">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    name="category"
                    value={editedProduct.category}
                    onChange={handleInputChange}
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Health & Beauty">Health & Beauty</option>
                    <option value="Home & Living">Home & Living</option>
                    <option value="Groceries & Food">Groceries & Food</option>
                    <option value="Toys & Baby">Toys & Baby</option>
                    <option value="Sports & Outdoors">Sports & Outdoors</option>
                    <option value="Automotive">Automotive</option>
                    <option value="Books, Music & Movies">
                      Books, Music & Movies
                    </option>
                    <option value="Pets & Animals">Pets & Animals</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={handleUpdateProduct}
            disabled={isUpdateDisabled || modalLoading}
          >
            {modalLoading ? "Updating..." : "Update"}
          </Button>
          <Button variant="secondary" onClick={handleCloseEdit}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showDeleteModal}
        onHide={handleCloseDelete}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this product?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={handleDeleteProduct}
            disabled={modalLoading}
          >
            {modalLoading ? "Deleting..." : "Delete"}
          </Button>
          <Button variant="secondary" onClick={handleCloseDelete}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Home;
