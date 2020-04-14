const Joi = require('joi');

function validateLogin(user) {
    const schema = {
        email: Joi.string().min(3).max(255).required().email(),
        password: Joi.string().min(3).max(255).required()
    };

    return Joi.validate(user, schema);
}

function validateRegistration(user) {
    const schema = {
        is_vyhovnyk: Joi.boolean(),
        name: Joi.string().min(3).max(255).required(),
        surname: Joi.string().min(3).max(255).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(3).max(255).required()
    };

    return Joi.validate(user, schema);
}

exports.validateLogin = validateLogin;
exports.validateRegistration = validateRegistration;

