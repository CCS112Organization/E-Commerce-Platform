import React, { useState } from 'react';
import './Form.css';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';

const RegistrationForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const handleRegistration = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
  
    // Check if passwords match
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      setIsLoading(false);
      return;
    }
  
    
    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      setIsLoading(false);
      return;
    }
  
    try {
      const response = await fetch('http://127.0.0.1:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password: password.trim(),
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        alert('Registration successful!');
        navigate('/'); 
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Something went wrong.');
      }
    } catch (error) {
      setErrorMessage('Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="loginform">
      <div className="wrapper">
        <form onSubmit={handleRegistration}>
          <h1>Register</h1>

          {errorMessage && <p className="error_form">{errorMessage}</p>}

          <div className="input-box">
            <input
              type="text"
              placeholder="Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <FaUser className="icon" />
          </div>

          <div className="input-box">
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FaEnvelope className="icon" />
          </div>

          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FaLock className="icon" />
          </div>

          <div className="input-box">
            <input
              type="password"
              placeholder="Confirm Password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <FaLock className="icon" />
          </div>

          <button
            className="btn btn-primary mt-3 form-control"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>

          <div className="text-center mt-3">
            <p>
              Already have an account?{' '}
              <Link to="/" className="text-primary">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
