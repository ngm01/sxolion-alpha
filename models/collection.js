const mongoose = require('mongoose');
const Book = require('./book');

var Collection = mongoose.model('Collection', {
    title: {
        type: String,
        required: true
    },
    // books: {
    //     type: [Book]
    // }
})

module.exports = {
    Collection
}