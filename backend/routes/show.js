const express = require('express');
const router = express.Router();
const upload = require('../utils/multer')

const { create, showsOfMovie, showById, allShows, deleteShow, getSingleShow, updateShow } = require('../controllers/ShowController')
const { isAuthenticated, isAuthorized } = require('../middleware/auth')

router.get('/list-all', isAuthenticated, isAuthorized('admin'), allShows);
router.get('/only-one/:id', isAuthenticated, isAuthorized('admin'), getSingleShow);
router.put('/update/:id', isAuthenticated, isAuthorized('admin'), upload.array('images'), updateShow);
router.post('/create', isAuthenticated, isAuthorized('admin'), upload.array('images'), create);
router.delete('/delete/:id', isAuthenticated, isAuthorized('admin'), upload.array('images'), deleteShow)

router.get('/shows-of-movie/:id', showsOfMovie);
router.get('/get-show/:id', showById);

module.exports = router;