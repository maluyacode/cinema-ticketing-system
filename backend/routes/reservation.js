const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth')

const { create } = require('../controllers/ReservationController');

router.post('/create', isAuthenticated, create);

module.exports = router;
