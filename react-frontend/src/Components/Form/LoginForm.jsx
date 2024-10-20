import React, { useState } from 'react';
import './Form.css';
import { FaUser } from 'react-icons/fa';
import { FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault(); 
    setError(null); 

    const loginData = {
      email: email,
      password: password,
    };

    fetch('http://127.0.0.1:8000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw new Error(errorData.message || 'Login failed');
          });
        }
        return response.json();
      })
      .then((data) => {
        localStorage.setItem('token', data.token);
        navigate('/dashboard/home');
      })
      .catch((err) => {
        setError(err.message); 
      });
  };

  return (
    <div className='loginform'>
      <div className='wrapper'>
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>

        {error && <p className="error">{error}</p>} 

        <div className="input-box">
          <input
            type="text"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FaUser className="icon" />
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

        <button type="submit">Login</button>
        </form>
      </div>
    </div>
    
  );
};

export default LoginForm;
