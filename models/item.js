var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ItemSchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: false },
        status: { type: String, required: true, enum: ['Available', 'Taken'], default: 'Available' },
    }
);

module.exports = mongoose.model('Item', ItemSchema);