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
    </div>
  );
}

export default AddItem;
