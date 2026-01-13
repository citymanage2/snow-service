const pool = require('../config/database');

const getRequests = async (req, res) => {
  try {
    const { city } = req.query;

    let query = `
      SELECT r.*, o.name as organization_name, u.name as operator_name
      FROM requests r
      LEFT JOIN organizations o ON r.organization_id = o.id
      LEFT JOIN users u ON r.operator_id = u.id
    `;

    const params = [];

    if (city) {
      query += ' WHERE r.city = $1';
      params.push(city);
    }

    query += ' ORDER BY r.created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createRequest = async (req, res) => {
  try {
    const { organization_id, city, address, work_type, volume } = req.body;

    if (!organization_id || !city || !address || !work_type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await pool.query(
      `INSERT INTO requests (organization_id, city, address, work_type, volume, status)
       VALUES ($1, $2, $3, $4, $5, 'new')
       RETURNING *`,
      [organization_id, city, address, work_type, volume || 0]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, operator_id } = req.body;

    const result = await pool.query(
      'UPDATE requests SET status = $1, operator_id = $2 WHERE id = $3 RETURNING *',
      [status, operator_id, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update request error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getCities = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT DISTINCT city FROM requests ORDER BY city'
    );
    res.json(result.rows.map(row => row.city));
  } catch (error) {
    console.error('Get cities error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getRequests, createRequest, updateRequest, getCities };
