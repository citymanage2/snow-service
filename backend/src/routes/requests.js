const express = require('express');
const router = express.Router();
const { getRequests, createRequest, updateRequest, getCities } = require('../controllers/requestsController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, getRequests);
router.get('/cities', authMiddleware, getCities);
router.post('/', authMiddleware, roleMiddleware('operator', 'manager', 'admin'), createRequest);
router.put('/:id', authMiddleware, roleMiddleware('operator', 'manager', 'admin'), updateRequest);

module.exports = router;
