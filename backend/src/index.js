require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const requestsRoutes = require('./routes/requests');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/requests', requestsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Snow Service API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
