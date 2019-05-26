var Item = require('../models/item');

// Display list of all instances
exports.item_list = function (req, res, next) {

    Item.find().exec(function (err, list_items) {
        if (err) { return (err, list_items); }
        // Successful, so render
        res.render('item_list', { title: 'Item List', item_list: list_items });
    });
};

// Display shopping-list on GET
exports.shoppinglist_get = function (req, res, next) {

    Item.find().exec(function (err, items) {
        console.log("Items: " + items);
        if (err) { return next(err); }
        // Successful, so render.
        res.render('shopping-list', { title: 'Shopping List', item_list: items });
    });
};