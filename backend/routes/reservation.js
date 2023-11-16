const express = require('express');
const router = express.Router();

const { create } = require('../controllers/ReservationController');

router.post('/create', create);

module.exports = router;
