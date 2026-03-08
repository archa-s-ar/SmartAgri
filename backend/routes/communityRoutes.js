const express = require('express');
const { getQueries, createQuery, addReply, deleteQuery } = require('../controllers/communityController');
const { authenticate } = require('../controllers/authController');
const router = express.Router();

router.get('/', getQueries);
router.post('/', authenticate, createQuery);
router.post('/:id/reply', authenticate, addReply);
router.delete('/:id', authenticate, deleteQuery);

module.exports = router;
