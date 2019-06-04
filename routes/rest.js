var express = require('express');
var router = express.Router();

// Require controller modules
var item_controller = require('../controllers/itemController');

// ITEM ROUTES

// Get all items
router.get('/items', item_controller.items_get);

// Create item
router.post('/item/create', item_controller.item_post);

// Update item
router.put('/item/:id/update', item_controller.item_put);

module.exports = router;