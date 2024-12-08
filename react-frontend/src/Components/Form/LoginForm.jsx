import React, { useState, useEffect } from 'react';
import './Form.css';
import { FaUser } from 'react-icons/fa';
import { FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const role = localStorage.getItem('role');
      if (role === 'admin') {
        navigate('/admin'); // Redirect to admin dashboard if the role is admin
      } else {
        navigate('/user'); // Redirect to user dashboard if the role is user
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    try {
      const response = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: trimmedEmail,
          password: trimmedPassword,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Store the token and role in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role); // Store the role as well

        // Redirect to the appropriate dashboard based on the role
        if (data.role === 'admin') {
          navigate('/admin'); // Admin dashboard
        } else {
          navigate('/user'); // User dashboard
        }
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
        <form onSubmit={handleLogin}>
          <h1>Login</h1>

          {errorMessage && <p className="error_form">{errorMessage}</p>}

          <div className="input-box">
            <input
              type="text"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMessage('');
              }}
            />
            <FaUser className="icon" />
          </div>

          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMessage('');
              }}
            />
            <FaLock className="icon" />
          </div>

          <button className="btn btn-primary mt-3 form-control" type="submit" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
          <div className="register-link">
            <p>
              Don’t have an account?{' '}
              <Link to="/register">
                Register{' '}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
