import Navbar from "../Dashboard/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './Pages/Home';
import Product from './Pages/ViewProduct';
import AddProduct from './Pages/AddProduct';

function Dashboard() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" exact Component={Home} />
          <Route path="/addproduct" Component={AddProduct} />
          <Route path="/viewproducts" Component={Product} />
        </Routes>
      </Router>
    </>
  );
}

export default Dashboard;
