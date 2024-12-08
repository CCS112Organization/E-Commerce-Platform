import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import { FaUser } from "react-icons/fa";
import GridLoader from "react-spinners/GridLoader";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import "./Home.css";

const API_URL_USER = "http://127.0.0.1:8000/api/user"; // Your API endpoint for fetching user data

const User = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // Redirect if not logged in
    } else {
      fetchUserData();
    }
  }, [navigate]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(API_URL_USER, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Failed to fetch user data.");
        return;
      }

      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setErrorMessage("Failed to fetch user data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container">
        <br/>
        <h1>User Profile</h1>
        <br/>
        {loading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "100vh" }}
          >
            <GridLoader color="#308fff" size={35} />
          </div>
        ) : errorMessage ? (
          <div className="alert alert-danger">{errorMessage}</div>
        ) : (
          user && (
            <Card className="mt-4">
              <Card.Body>
                <Row>
                  <Col sm={4}>
                    <div className="text-center">
                      <FaUser size={100} color="#0c928b" />
                    </div>
                  </Col>
                  <Col sm={8}>
                    <h3>{user.name}</h3>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Contact Details:</strong> {user.contact_info}</p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )
        )}
      </div>
      <Toaster richColors position="bottom-right" />
    </>
  );
};

export default User;
