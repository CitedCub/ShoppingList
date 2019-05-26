var express = require('express');
var router = express.Router();

// Require controller modules
var item_controller = require('../controllers/itemController');

// ITEM ROUTES

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// GET request for shopping-list app
router.get('/shopping-list', item_controller.shoppinglist_get);

// GET request for a list of all items.
router.get('/items', item_controller.item_list);

module.exports = router;
