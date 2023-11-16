const express = require('express');
const router = express.Router();

const { create, showsOfMovie, showById } = require('../controllers/ShowController')

router.post('/create', create);
router.get('/shows-of-movie/:id', showsOfMovie);
router.get('/get-show/:id', showById);

module.exports = router;