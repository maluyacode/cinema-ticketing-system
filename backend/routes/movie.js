const express = require('express');
const router = express.Router();
const upload = require('../utils/multer')

const { isAuthenticated, isAuthorized } = require('../middleware/auth');
const {
    create,
    movieWithFutureShows,
    listAllMovies,
    deleteMovie,
    getSingleMovie,
    movieUpdate,
    commingSoon
} = require('../controllers/MovieController');

router.get('/list-all', listAllMovies);
router.post('/create', isAuthenticated, isAuthorized('admin'), upload.array("images"), create);
router.get('/with-future-show', movieWithFutureShows);
router.delete('/delete/:id', isAuthenticated, isAuthorized('admin'), deleteMovie);
router.get('/only-one/:id', isAuthenticated, isAuthorized('admin'), getSingleMovie);
router.put('/update/:id', isAuthenticated, isAuthorized('admin'), upload.array("images"), movieUpdate);
router.get('/comming-soon', commingSoon);

module.exports = router;