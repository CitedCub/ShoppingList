var Item = require('../models/item');

// Display list of all instances
exports.item_list = function (req, res, next) {

    Item.find().exec(function (err, list_items) {
        if (err) { return (err, list_items); }
        // Successful, so render
        res.render('item_list', { title: 'Item List', item_list: list_items });
    });
};