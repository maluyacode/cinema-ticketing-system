const express = require('express');
const router = express.Router();
const upload =  require('../utils/multer')
const { getAllUsers, register } = require('../controllers/UserController')

router.post('/register', upload.single("profile_pic"), register);

module.exports = router;