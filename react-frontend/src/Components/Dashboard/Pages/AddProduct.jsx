<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { Button, Form, Card, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AddProduct.css";

function AddProduct() {
  const [defaultValue, setDefaultValue] = useState('');

  const generateRandomNumber = () => {
    const randomNumber = Math.floor(100000000000 + Math.random() * 900000000000);
    setDefaultValue(randomNumber.toString());
  };

  // const [code, setCode] = useState("");
  // const [title, setTitle] = useState("");
  // const [description, setDescription] = useState("");
  // const [status, setStatus] = useState("Pending");
  // const [dueDate, setDueDate] = useState("");

  // const handleSubmit = (e) => {
    // e.preventDefault(); // Prevent the default form submission

    // // Create the data object to be sent to the API
    // const prodData = {
    //   code: code,
    //   title: title,
    //   description: description,
    //   status: status,
    //   due_date: dueDate,
    // };
    // console.log(prodData);

    // // Post the data to the API
    // fetch("http://127.0.0.1:8000/api/tasks/", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(prodData),
    // })
    //   .then((response) => {
    //     if (!response.ok) {
    //       throw new Error("Network response was not ok");
    //     }
    //     return response.json();
    //   })
    //   .then((data) => {
    //     console.log("Success:", data);
    //     // You can reset the form or display a success message here
    //   })
    //   .catch((error) => {
    //     console.error("Error:", error);
    //   });
  // };
  return (
    <div className="container">
      <Card>
        <Card.Header>
          <h1>Add Product</h1>
        </Card.Header>
        <Card.Body>
          <Form>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="barcode">
                  <Form.Label>Barcode (UPC)</Form.Label>
                  <Form.Control type="text" placeholder="Enter barcode" defaultValue={defaultValue} readOnly/>
                  <Button variant="primary" onClick={generateRandomNumber}>
                Generate New Random Number
            </Button>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="name">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control type="text" placeholder="Enter product name" />
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
                  <Form.Select>
                    <option>Category</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Card.Body>
        <Card.Footer>
          <div className="d-flex w-100 justify-content-center align-items-center">
            <Button variant="primary">Save</Button>
          </div>
        </Card.Footer>
      </Card>
=======
import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import './AddProduct.css'; // Import the CSS file

function AddItem({ onAdd }) {
  const [product, setProduct] = useState({
    id: '',
    name: '',
    description: '',
    quantity: '',
    price: '',
    category: 'Electronics', // Default category
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call the onAdd function passed from the parent to add the new product
    onAdd(product);
    // Reset form
    setProduct({
      id: '',
      name: '',
      description: '',
      quantity: '',
      price: '',
      category: 'Electronics',
    });
  };

  return (
    <div className="add-item-container">
      <h2>Add New Product</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="productId">
          <Form.Label>Product ID:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter product ID"
            name="id"
            value={product.id}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="productName">
          <Form.Label>Product Name:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter product name"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="productDescription">
          <Form.Label>Product Description:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter product description"
            name="description"
            value={product.description}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="productQuantity">
          <Form.Label>Quantity:</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter quantity"
            name="quantity"
            value={product.quantity}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="productPrice">
          <Form.Label>Price:</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter price"
            name="price"
            value={product.price}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="productCategory">
          <Form.Label>Category:</Form.Label>
          <Form.Select
            name="category"
            value={product.category}
            onChange={handleChange}
          >
            <option value="Electronics">Electronics</option>
            <option value="Furniture">Furniture</option>
            {/* Add more categories as needed */}
          </Form.Select>
        </Form.Group>

        <Button variant="primary" type="submit">
          Add Product
        </Button>
      </Form>
>>>>>>> d185e1f359686fcf6ed7de8f6ad58a9cb07c1788
    </div>
  );
}

<<<<<<< HEAD
export default AddProduct;
=======
export default AddItem;
>>>>>>> d185e1f359686fcf6ed7de8f6ad58a9cb07c1788
