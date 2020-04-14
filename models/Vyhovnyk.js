const mongoose = require('mongoose');
const config = require('config');
const jwt = require('jsonwebtoken');


var VyhovnykSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255,
    },
    surname: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255,
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
    },
    password: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    gurtok: {
        type: Array
    }
});
VyhovnykSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, config.get('myprivatekey')); //get the private key from the config file -> environment variable
    return token;
}

var Vyhovnyk = mongoose.model('Vyhovnyk', VyhovnykSchema);


exports.Vyhovnyk = Vyhovnyk;
