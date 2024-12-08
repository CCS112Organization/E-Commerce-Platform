import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './Pages/Home';
import User from './Pages/User';
import ViewCart from './Pages/ViewCart';
import Checkout from './Pages/Checkout';
import Navbar from './Navbar';

function Dashboard() {
  return (
    <>
    <Navbar />
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/profile" element={<User />} />
        <Route path="/view-cart" element={<ViewCart />} /> 
        <Route path="/checkout" element={<Checkout />} /> 
      </Routes>
    </>
  );
}

export default Dashboard;
