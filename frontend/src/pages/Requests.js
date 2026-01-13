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
      console.error('Error fetching cities:', error);
    }
  };

  const fetchRequests = async (city = '') => {
    setLoading(true);
    try {
      const response = await getRequests(city);
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
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
      case 'new': return 'New';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  return (
    <div className="requests-container">
      <header className="header">
        <h1>Snow Service Requests</h1>
        <div className="user-info">
          <span>{user.name} ({user.role})</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="filters">
        <label>
          Filter by city:
          <select value={selectedCity} onChange={handleCityChange}>
            <option value="">All Cities</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </label>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="requests-grid">
          {requests.length === 0 ? (
            <div className="no-requests">No requests found</div>
          ) : (
            requests.map(request => (
              <div key={request.id} className="request-card">
                <div className="request-header">
                  <h3>Request #{request.id}</h3>
                  <span className={`status ${getStatusClass(request.status)}`}>
                    {getStatusLabel(request.status)}
                  </span>
                </div>
                <div className="request-body">
                  <p><strong>Organization:</strong> {request.organization_name}</p>
                  <p><strong>City:</strong> {request.city}</p>
                  <p><strong>Address:</strong> {request.address}</p>
                  <p><strong>Work Type:</strong> {request.work_type}</p>
                  <p><strong>Volume:</strong> {request.volume} m³</p>
                  {request.operator_name && (
                    <p><strong>Operator:</strong> {request.operator_name}</p>
                  )}
                  <p className="created-at">
                    Created: {new Date(request.created_at).toLocaleString()}
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
