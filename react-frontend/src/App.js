import LoginForm from './Components/Form/LoginForm';
import Dashboard from './Components/Dashboard/Main';
import RegistrationForm from './Components/Form/RegisForm';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} /> 
        <Route path="/dashboard/*" element={<Dashboard />} /> 
        <Route path="/register" element={<RegistrationForm />} />
      </Routes>
    </Router>
  );
}

export default App;
