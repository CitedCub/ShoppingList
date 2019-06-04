const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var Item = require('../models/item');

// Display list of all items
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
        if (err) { return next(err); }
        // Successful, so render.
        res.render('shopping-list', { title: 'Shopping List', item_list: items });
    });
};

// Handle item create on POST
exports.shoppinglist_post = [


    // Validate fields
    body('item_name', 'Item name must be specified').isLength({ min: 1 }).trim(),

    // Sanitize fields
    sanitizeBody('item').escape(),

    // Process request after validation and sanitization
    (req, res, next) => {

        // Extract the validation errors from a request
        const errors = validationResult(req);

        // Create an Item object with escaped and trimmed data
        var iteminstance = new Item(
            {
                name: req.body.item_name,
                status: 'Available',
            });

        if (errors.isEmpty()) {
            // No validation errors
            console.log('No validation errors');

            iteminstance.save(function (err) {
                if (err) {
                    console.log('Error saving item');
                    return next(err);
                }
            });
        }

        Item.find({}, 'status')
            .exec(function (err, items) {
                if (err) {
                    console.log('Error fetching items from database');
                    return next(err);
                }
                // Render
                res.render('shopping-list', { title: 'Shopping List', item_list: items, errors: errors.array() });
            });
        return;
    },
];

exports.items_get = function (req, res, next) {
    Item.find().exec(function (err, items) {
        if (err) { return next(err); }
        res.send(items);
    })
}

exports.item_put = function (req, res, next) {

    // Create an item instance object with old id
    var item = new Item(
        {
            name: req.body.name,
            status: req.body.status == 'Available' ? 'Taken' : 'Available',
            description: req.body.description,
            _id: req.params.id // This is required, or a new ID will be assigned!
        });

    Item.findByIdAndUpdate(req.params.id, item, {}, function (err, theitem) {
        if (err) { return next(err); }
        res.send(item);
    });
}

exports.item_post = function (req, res, next) {

    console.log('In item_post');
    // Create an item instance object
    var item = new Item(
        {
            name: req.body.name,
            status: 'Available',
        });

    item.save(function (err) {
        if (err) { return next(err) }
        exports.items_get(req, res, next);
    });
}