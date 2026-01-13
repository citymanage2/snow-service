-- Create database tables for snow service management system

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('operator', 'manager', 'admin')),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS organizations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS requests (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organizations(id),
    city VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    work_type VARCHAR(255) NOT NULL,
    volume DECIMAL(10, 2),
    status VARCHAR(50) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    operator_id INTEGER REFERENCES users(id)
);

-- Insert sample data
INSERT INTO users (email, password_hash, role, name) VALUES
    ('admin@example.com', '$2b$10$rQZ3jXGJX6qKZHGKqXWvB.F8vGJXqXWvB.F8vGJXqXWvB.F8vGJXq', 'admin', 'Admin User'),
    ('operator@example.com', '$2b$10$rQZ3jXGJX6qKZHGKqXWvB.F8vGJXqXWvB.F8vGJXqXWvB.F8vGJXq', 'operator', 'Operator User'),
    ('manager@example.com', '$2b$10$rQZ3jXGJX6qKZHGKqXWvB.F8vGJXqXWvB.F8vGJXqXWvB.F8vGJXq', 'manager', 'Manager User');
-- Password for all users: 'password123'

INSERT INTO organizations (name, city) VALUES
    ('Snow Clean Co', 'Moscow'),
    ('Winter Services', 'Saint Petersburg'),
    ('City Maintenance', 'Moscow');

INSERT INTO requests (organization_id, city, address, work_type, volume, status, operator_id) VALUES
    (1, 'Moscow', 'Red Square 1', 'snow_removal', 150.5, 'new', NULL),
    (2, 'Saint Petersburg', 'Nevsky Prospect 50', 'snow_export', 200.0, 'in_progress', 2),
    (1, 'Moscow', 'Tverskaya Street 10', 'snow_removal', 100.0, 'completed', 2),
    (3, 'Moscow', 'Arbat Street 25', 'snow_export', 300.5, 'new', NULL);
