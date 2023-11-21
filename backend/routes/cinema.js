const express = require('express');
const router = express.Router();
const upload = require('../utils/multer')

const { create, allCinemas, getSingleCinema, updateCinema, deleteCinema } = require('../controllers/CinemaController');
const { isAuthenticated, isAuthorized } = require('../middleware/auth');

router.post('/create', isAuthenticated, isAuthorized('admin'), upload.array('images'), create);
router.get('/list-all', isAuthenticated, isAuthorized('admin'), allCinemas);
router.get('/get-one/:id', isAuthenticated, getSingleCinema);
router.put('/update/:id', isAuthenticated, isAuthorized('admin'), upload.array('images'), updateCinema);
router.delete('/delete/:id', isAuthenticated, isAuthorized('admin'), deleteCinema);

module.exports = router;