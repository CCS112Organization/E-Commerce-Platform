import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
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
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import Navbar from "../Navbar";
import "./Home.css";

const User = () => {
  return (
    <>
      <Navbar />
      <div className="container">
        <h1>Test</h1>
      </div>
    </>
  );
};
export default User;
