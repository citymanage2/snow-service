import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import './Login.css';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await login(email, password);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      navigate('/requests');
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка входа');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Управление снежной уборкой</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Электронная почта:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Пароль:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit">Вход</button>
        </form>
        <div className="demo-credentials">
          <p>Учетные данные для демонстрации:</p>
          <ul>
            <li>admin@example.com / password123</li>
            <li>operator@example.com / password123</li>
            <li>manager@example.com / password123</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;
