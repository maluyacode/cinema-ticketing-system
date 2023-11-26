const express = require('express');
const router = express.Router();
const { isAuthenticated, isAuthorized } = require('../middleware/auth')

const { create, getAllReservations, deleteReservation, getSingleReservation, updateReservation } = require('../controllers/ReservationController');

router.post('/create', isAuthenticated, create);
router.get('/list-all', isAuthenticated, isAuthorized('admin'), getAllReservations)
router.put('/update/:id', isAuthenticated, isAuthorized('admin'), updateReservation)
router.get('/only-one/:id', isAuthenticated, isAuthorized('admin'), getSingleReservation)
router.delete('/delete/:id', isAuthenticated, isAuthorized('admin'), deleteReservation);

module.exports = router;
