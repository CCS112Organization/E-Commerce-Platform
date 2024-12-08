import React, { useState } from 'react';
import './Form.css';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { BiSolidContact } from "react-icons/bi";

const RegistrationForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    evaluatePasswordStrength(newPassword);
  };

  const evaluatePasswordStrength = (password) => {
    let strength = 0;

    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 1) {
      setPasswordStrength({ label: 'Weak', color: 'red' });
    } else if (strength === 2) {
      setPasswordStrength({ label: 'Fair', color: 'orange' });
    } else if (strength === 3) {
      setPasswordStrength({ label: 'Good', color: 'blue' });
    } else if (strength >= 4) {
      setPasswordStrength({ label: 'Strong', color: 'green' });
    } else {
      setPasswordStrength(null);
    }
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    if (passwordStrength.label === 'Weak') {
      setErrorMessage("Please choose a stronger password.");
      setIsLoading(false);
      return;
    }

    if (contact.length !== 11) {
      setErrorMessage("Contact number must be 11 digits long.");
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
          contact_info: contact.trim(),
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
              type="text"
              placeholder="Contact"
              required
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
            <BiSolidContact className="icon" />
          </div>

          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={handlePasswordChange}
            />
            <FaLock className="icon" />
          </div>

          {passwordStrength && (
            <div className="password-strength">
              <span
                style={{
                  color: passwordStrength.color,
                  fontWeight: 'bold',
                }}
              >
                {passwordStrength.label}
              </span>
            </div>
          )}

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

          <div className="register-link">
            <p>
              Already have an account?{' '}
              <Link to="/">Login</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
