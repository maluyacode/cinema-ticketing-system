const express = require('express');
const router = express.Router();
const upload = require('../utils/multer')

const { isAuthenticated, isAuthorized } = require('../middleware/auth');
const { create, movieWithFutureShows } = require('../controllers/MovieController');

router.post('/create', upload.array("images"), create);
router.get('/with-future-show', movieWithFutureShows);

module.exports = router;