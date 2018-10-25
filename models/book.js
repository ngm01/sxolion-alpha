const mongoose = require('mongoose');

var Book = mongoose.model('Book', {
    title: {
        type: String
    },
    author: {
        type: String
    },
    isbn13: {
        type: String
    },
    googleBooksId: {
        type: String
    }
})

module.exports = {
    Book
}