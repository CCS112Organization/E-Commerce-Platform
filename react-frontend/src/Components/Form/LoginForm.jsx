import React, { useState } from 'react';
import './Form.css';
import { FaUser } from 'react-icons/fa';
import { FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setIsLoading(true);
    setErrorMessage(null); 

    try {
      const response = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
      });
  
      const loginData = {
        email: email,
        password: password,
      };

      if (!response.ok) {
          throw new Error('Invalid username or password');
      }else if(response.status === 401){
          throw new Error('Invalid credentials');
      }else if (response.status === 500){
          throw new Error('Server error');
      }else if (response.status === 200){
          console.log('Login successful');
          const data = await response.json();
          localStorage.setItem('token', data.access_token);  
          localStorage.setItem('user', JSON.stringify(data.user));
          console.log(data.user);
          navigate('/dashboard'); 
      }

    } catch (error) {
      setErrorMessage(error.message || 'Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='loginform'>
      <div className='wrapper'>
      <form onSubmit={handleLogin}>
        <h1>Login</h1>

        {errorMessage && <p className="error">{errorMessage}</p>} 

        <div className="input-box">
          <input
            type="text"
            placeholder="Email"
            required
            value={email}
            onChange={(e) =>{
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

        <button className='btn btn-primary mt-3 form-control' type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        
        </form>
      </div>
    </div>
    
  );
};

export default LoginForm;
