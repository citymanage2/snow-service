import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRequests, getCities } from '../services/api';
import './Requests.css';

const Requests = ({ user }) => {
  const [requests, setRequests] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCities();
    fetchRequests();
  }, []);

  const fetchCities = async () => {
    try {
      const response = await getCities();
      setCities(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке городов:', error);
    }
  };

  const fetchRequests = async (city = '') => {
    setLoading(true);
    try {
      const response = await getRequests(city);
      setRequests(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке заявок:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
    fetchRequests(city);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'new': return 'status-new';
      case 'in_progress': return 'status-progress';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'new': return 'Новая';
      case 'in_progress': return 'В работе';
      case 'completed': return 'Выполнена';
      case 'cancelled': return 'Отменена';
      default: return status;
    }
  };

  return (
    <div className="requests-container">
      <header className="header">
        <h1>Заявки на снежную уборку</h1>
        <div className="user-info">
          <span>{user.name} ({user.role})</span>
          <button onClick={handleLogout} className="logout-btn">Выход</button>
        </div>
      </header>

      <div className="filters">
        <label>
          Фильтр по городу:
          <select value={selectedCity} onChange={handleCityChange}>
            <option value="">Все города</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </label>
      </div>

      {loading ? (
        <div className="loading">Загрузка...</div>
      ) : (
        <div className="requests-grid">
          {requests.length === 0 ? (
            <div className="no-requests">Заявок не найдено</div>
          ) : (
            requests.map(request => (
              <div key={request.id} className="request-card">
                <div className="request-header">
                  <h3>Заявка №{request.id}</h3>
                  <span className={`status ${getStatusClass(request.status)}`}>
                    {getStatusLabel(request.status)}
                  </span>
                </div>
                <div className="request-body">
                  <p><strong>Организация:</strong> {request.organization_name}</p>
                  <p><strong>Город:</strong> {request.city}</p>
                  <p><strong>Адрес:</strong> {request.address}</p>
                  <p><strong>Тип работ:</strong> {request.work_type}</p>
                  <p><strong>Объем:</strong> {request.volume} м³</p>
                  {request.operator_name && (
                    <p><strong>Оператор:</strong> {request.operator_name}</p>
                  )}
                  <p className="created-at">
                    Создано: {new Date(request.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Requests;
