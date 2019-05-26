#! /usr/bin/env node

console.log('This script populates some test items to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0-mbdj7.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Item = require('./models/item')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var items = []

function itemCreate(name, description, status, cb) {
    itemdetail = {
        name: name,
        description: description
    }
    if (status != false) itemdetail.status = status

    var item = new Item(itemdetail);

    console.log(item);

    item.save(function (err) {
        if (err) {
            console.log('ERROR CREATING Item: ' + item);
            cb(err, null)
            return
        }
        console.log('New Item: ' + item);
        items.push(item)
        cb(null, item)
    });
}
function createItems(cb) {
    async.series([
        function (callback) {
            itemCreate('Tomat', 'Kvisttomat eller inte, ta den billigaste', false, callback);
        },
        function (callback) {
            itemCreate('Gurka', 'Ofta styckpris, ta stora gurkor', false, callback);
        },
        function (callback) {
            itemCreate('Müsli', 'Gärna Sunt & Gott, glöm inte separata russin', false, callback);
        },
        function (callback) {
            itemCreate('Russin', 'Sun-Maid är ofta fräschare än ICAs egna', false, callback);
        },
        function (callback) {
            itemCreate('Ägg', 'Tag storlek L. M är för små', 'Taken', callback);
        },
    ],
        cb);
}

async.series([
    createItems
],
    // Optional callback
    function (err, results) {
        if (err) {
            console.log('FINAL ERR: ' + err);
        }
        else {
            console.log('Items: ' + items);

        }
        // All done, disconnect from database
        mongoose.connection.close();
    }
);



