import LoginForm from './Components/Form/LoginForm';
import AdminDashboard from './Components/AdminDashboard/Main';
import UserDashboard from './Components/UserDashboard/Main';
import RegistrationForm from './Components/Form/RegisForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} /> 
        <Route path="/admin/*" element={<AdminDashboard />} /> 
        <Route path="/user/*" element={<UserDashboard />} /> 
        <Route path="/register" element={<RegistrationForm />} />
      </Routes>
    </Router>
  );
}

export default App;
