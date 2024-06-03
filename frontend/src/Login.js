import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles.css';

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [error, setError] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  const [disableLoginButton, setDisableLoginButton] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username ||!password) {
      setError('Both username and password are required.');
      return;
    }

    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    try {
      const response = await axios.post('http://localhost:8000/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
      });

      console.log('Login successful:', response.data);
      localStorage.setItem('token', response.data['access_token']);
      
      navigate(`/main`);
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.response? (error.response.data && error.response.data.detail? error.response.data.detail : 'An error occurred while logging in.') : 'An error occurred while logging in.');
    }
  };

  const handleSignUpClick = () => {
    if (showEmailInput) {
      handleRegister();
    } else {
      setShowEmailInput(true);
      setIsCreatingAccount(true);
      setDisableLoginButton(true);
    }
  };

  const handleRegister = async () => {
    if (!username ||!password ||!email) {
      setError('Both username and password are required, and email is also required for registration.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:8000/auth/register', {
        username,
        email,
        password,
      });
      console.log('Registration successful:', response.data);
      setUsername('');
      setPassword('');
      setEmail('');
      setShowEmailInput(false);
      setIsCreatingAccount(false);
      setDisableLoginButton(false);
      window.location.href = "/main";
    } catch (error) {
      console.error('Registration failed:', error);
      setError('An error occurred while registering.');
    }
  };

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        <p id="heading">Login</p>
        <div className="field">
          <input autoComplete="off" placeholder="Username" className="input-field" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="field">
          <input placeholder="Password" className="input-field" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {showEmailInput && (
          <div className="field">
            <input placeholder="Email" className="input-field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        )}
        <div className="btn">
          <button className="button1" type="submit" disabled={disableLoginButton}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Login&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</button>
          <button className="button2" onClick={handleSignUpClick}>Sign Up</button>
        </div>
      </form>
      {error && <div style={{ marginTop: '20px' }}>{error}</div>}
    </div>
  );
}

export default Login;
