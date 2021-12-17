const {body} = require('express-validator');
const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');

exports.loginValidators = [
    body('email')
        .custom(async (value, {req}) => {
            const candidate = await Admin.findOne({ where: {email: value} });
            if (!candidate) {
                return Promise.reject('Неверный email или пароль');
            }
        }),
    body('password')
        .custom(async (value, {req}) => {
            const {email} = req.body;
            const candidate = await Admin.findOne({ where: {email} })
            const areSame = await bcrypt.compare(value, candidate.password);
            if (!areSame) {
                throw new Error('Неверный email или пароль');
            }
        })
]