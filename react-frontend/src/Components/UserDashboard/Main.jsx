import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './Pages/Home';
import User from './Pages/User';

function Dashboard() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/profile" element={<User />} />
      </Routes>
    </>
  );
}

export default Dashboard;
