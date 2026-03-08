const express = require('express');
const { getRecommendations } = require('../controllers/cropController');
const router = express.Router();

router.post('/', getRecommendations);

module.exports = router;
