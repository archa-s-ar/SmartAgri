const express = require('express');
const { getMarketListings, createListing, updateListing, deleteListing } = require('../controllers/marketController');
const { authenticate } = require('../controllers/authController');
const router = express.Router();

router.get('/', getMarketListings);
router.post('/', authenticate, createListing);
router.put('/:id', authenticate, updateListing);
router.delete('/:id', authenticate, deleteListing);

module.exports = router;
