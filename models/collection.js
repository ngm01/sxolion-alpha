const mongoose = require('mongoose');

var Collection = mongoose.model('Collection', {
    user: {
        type: String,
        require: true
    }

})