import Navbar from "../Dashboard/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './Pages/Home';
import AddProduct from './Pages/AddProduct';
import "./Main.css";

function Dashboard() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" exact Component={Home} />
          <Route path="/addproduct" Component={AddProduct} />
        </Routes>
      </Router>
    </>
  );
}

export default Dashboard;
