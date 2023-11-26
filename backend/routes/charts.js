const express = require('express');
const router = express.Router();
const { isAuthenticated, isAuthorized } = require('../middleware/auth')
const { mostWatch, salesPerMonth, movieHasMostSales } = require('../controllers/ChartsController')

router.get('/most-watch', mostWatch)
router.get('/sales-per-month', salesPerMonth)
router.get('/movie-has-most-sales', movieHasMostSales)

module.exports = router