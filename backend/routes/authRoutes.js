const express = require('express');
const { register, login, getUserParams } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/user/:id', getUserParams);

module.exports = router;
