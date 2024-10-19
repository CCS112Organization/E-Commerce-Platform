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
