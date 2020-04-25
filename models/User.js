const mongoose = require('mongoose');
const config = require('config');
const jwt = require('jsonwebtoken');

var UserSchema = new mongoose.Schema({
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
        // unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    check_lists: {
        type: Array,
        required: true,
    }
});



UserSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, config.get('myprivatekey')); //get the private key from the config file -> environment variable
    return token;
}

var User = mongoose.model('User', UserSchema);

exports.User = User;