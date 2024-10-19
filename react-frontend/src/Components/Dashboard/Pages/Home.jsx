<<<<<<< HEAD
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Form, Button, Card, Modal, Row, Col } from "react-bootstrap";
import "./Home.css";

const productData = [
  {
    id: 134356890564,
    name: "Mouse",
    description: "Wired mouse with 2 meter cable",
    quantity: 10,
    price: 500,
    category: "Electronics",
  },
  {
    id: 2,
    name: "rk60",
    description: "Wireless keyboard",
    quantity: 5,
    price: 1650,
    category: "Electronics",
  },
  {
    id: 3,
    name: "Asus Monitor",
    description: "144hz monitor",
    quantity: 8,
    price: 10623,
    category: "Electronics",
  },
  {
    id: 4,
    name: "Table",
    description: "Wooden table",
    quantity: 4,
    price: 2999,
    category: "Furniture",
  },
  {
    id: 5,
    name: "Chair",
    description: "Office chair",
    quantity: 15,
    price: 799,
    category: "Furniture",
  },
  {
    id: 6,
    name: "Chair",
    description: "Gaming chair",
    quantity: 4,
    price: 799,
    category: "Furniture",
  },
  {
    id: 7,
    name: "Chair",
    description: "Folding chair",
    quantity: 16,
    price: 799,
    category: "Furniture",
  },
  {
    id: 8,
    name: "Chair",
    description: "Arm chair",
    quantity: 25,
    price: 799,
    category: "Furniture",
  },
];

function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [filteredData, setFilteredData] = useState(productData);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editedProduct, setEditedProduct] = useState({
    id: null,
    name: "",
    description: "",
    quantity: 0,
    price: 0,
    category: "Electronics",
  });

  const handleCloseEdit = () => setShowEditModal(false);
  const handleCloseDelete = () => setShowDeleteModal(false);

  const handleShowEdit = (product) => {
    setSelectedProduct(product);
    setEditedProduct(product);
    setShowEditModal(true);
  };
  const handleSaveChanges = () => {
    const updatedData = filteredData.map((product) =>
      product.id === editedProduct.id ? editedProduct : product
    );
    setFilteredData(updatedData);
    handleCloseEdit();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleShowDelete = () => {
    setShowDeleteModal(true);
  };

  // Handle search by ID
  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    filterData(value, categoryFilter);
  };

  // Handle category filter
  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setCategoryFilter(category);
    filterData(searchTerm, category);
  };

  // Filter data based on search term and category
  const filterData = (id, category) => {
    let data = productData;

    // Filter by ID
    if (id) {
      data = data.filter((product) => product.id.toString().includes(id));
    }

    // Filter by category (if not "All")
    if (category !== "All") {
      data = data.filter((product) => product.category === category);
    }

    setFilteredData(data);
  };

  return (
    <>
      <div className="container">
        <Card>
          <Card.Header>
            <h1>Product Table</h1>
          </Card.Header>
          <Card.Body>
            <Form>
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="search">
                    <Form.Label className="mb-">
                      Search by Product ID:
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter product ID"
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3" controlId="category">
                    <Form.Label>Filter by Category:</Form.Label>
                    <Form.Select
                      value={categoryFilter}
                      onChange={handleCategoryChange}
                    >
                      <option value="All">All</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Furniture">Furniture</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Form>
            {/* Product Table */}
            <div style={{ maxHeight: "335px", overflowY: "auto" }}>
              <Table striped bordered hover responsive="sm">
                <thead>
                  <tr>
                    <th>Product ID</th>
                    <th>Product Name</th>
                    <th>Product Description</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((product) => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>{product.name}</td>
                      <td>{product.description}</td>
                      <td>{product.quantity}</td>
                      <td>{product.price}</td>
                      <td>{product.category}</td>
                      <td>
                        <Button
                          variant="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => handleShowEdit(product)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={handleShowDelete}
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
          <Form className="sample">
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="barcode">
                  <Form.Label>Barcode (UPC)</Form.Label>
                  <Form.Control
                    type="text"
                    name="id"
                    value={editedProduct.id}
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
                  <Form.Label>Quantity</Form.Label>
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
                    <option value="Furniture">Furniture</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSaveChanges}>
            Update
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
          <Button variant="danger" onClick={handleCloseDelete}>
            Delete
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
=======
import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './Home.css';

// Sample product data

const productData = [
  { id: 134356890564, name: 'Mouse', description: 'Wired mouse with 2 meter cable', quantity: 10, price: 500, category: 'Electronics' },
  { id: 2, name: 'rk60', description: 'Wireless keyboard', quantity: 5, price: 1650, category: 'Electronics' },
  { id: 3, name: 'Asus Monitor', description: '144hz monitor', quantity: 8, price: 10623, category: 'Electronics' },
  { id: 4, name: 'Table', description: 'Wooden table', quantity: 4, price: 2999, category: 'Furniture' },
  { id: 5, name: 'Chair', description: 'Office chair', quantity: 15, price: 799, category: 'Furniture' },
];

function ProductTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [filteredData, setFilteredData] = useState(productData);

  // Handle search by ID
  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    filterData(value, categoryFilter);
  };

  // Handle category filter
  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setCategoryFilter(category);
    filterData(searchTerm, category);
  };

  // Filter data based on search term and category
  const filterData = (id, category) => {
    let data = productData;

    // Filter by ID
    if (id) {
      data = data.filter((product) =>
        product.id.toString().includes(id)
      );
    }

    // Filter by category (if not "All")
    if (category !== 'All') {
      data = data.filter((product) => product.category === category);
    }

    setFilteredData(data);
  };

  return (
    <>
      <div class ="wrapper">
          <div class="wrapper">
            <h1>Product Table</h1>
          </div>

          {/* Search Input */}
          <Form.Group className="mb-3" controlId="search">
            <Form.Label className="mb-">Search by Product ID:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter product ID"
              value={searchTerm}
              onChange={handleSearch}
            />
          </Form.Group>

          {/* Category Select */}
          <Form.Group className="mb-3" controlId="category">
            <Form.Label>Filter by Category:</Form.Label>
            <Form.Select value={categoryFilter} onChange={handleCategoryChange}>
              <option value="All">All</option>
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
            </Form.Select>
          </Form.Group>

          {/* Product Table */}
          <Table striped bordered hover responsive="sm">
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Product Description</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>{product.quantity}</td>
                  <td>{product.price}</td>
                  <td>{product.category}</td>
                  <td>
                    <Button ClassName ="edit-btn"
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(product.id)}
                    >
                      Edit
                    </Button>
                    <Button ClassName ="delete-btn"
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </>
    );
  }

// Sample edit and delete handlers
function handleEdit(id) {
  alert(`Editing product with ID: ${id}`);
}

function handleDelete(id) {
  if (window.confirm(`Are you sure you want to delete product with ID: ${id}?`)) {
    alert(`Deleted product with ID: ${id}`);
  }
}

export default ProductTable;
>>>>>>> d185e1f359686fcf6ed7de8f6ad58a9cb07c1788
