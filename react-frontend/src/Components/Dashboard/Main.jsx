import Navbar from "../Dashboard/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from './Pages/Home';
import AddProduct from './Pages/AddProduct';


function Dashboard() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/home" element={<Home />} /> 
        <Route path="/addproduct" element={<AddProduct />} /> 
      </Routes>
    </>
  );
}

export default Dashboard;
