const express = require('express');
const router = express.Router();
const upload = require('../utils/multer')

const { create } = require('../controllers/CinemaController');

router.post('/create', upload.array('images'), create);

module.exports = router;