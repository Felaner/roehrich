'use strict'

const {Router} = require('express');
const router = Router();
const fs = require('fs');
const {loginValidators} = require('../utils/validators');
const Admin = require('../models/admin');
const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const { divide: Divide, product: Product } = require('../models/divide')

router.get('/', async (req, res) => {
    await Divide.findAll({
        attributes: ['id', 'name', 'srcImage'],
        include: [{
            model: Product,
            attributes: ['id', 'name']
        }]
    }).then(divides => {
        const menuDivides = divides.slice(0, 4)
        res.render('control/admin', {
            title: 'Главная',
            isAdmin: true,
            loginError: req.flash('loginError'),
            menuDivides
        });
    })
});

router.post('/', loginValidators, async (req, res) => {
    try {
        const {email} = req.body;
        const candidate = await Admin.findOne({ where: {email} })
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('loginError', errors.array()[0].msg);
            return res.status(422).redirect('/admin')
        }
        req.session.user = candidate;
        req.session.isAuthenticated = true;
        req.session.save(err => {
            if (err) {
                throw err
            }
            res.redirect('/');
        });
    } catch(e) {
        console.log(e);
    }
})

router.get('/logout', async (req, res) => {
    try {
        req.session.destroy(() => {
            res.redirect('/')
        })
    } catch(e) {
        console.log(e);
    }
});

router.post('/register', async (req, res, next) => {
    try {
        const {email, password} = req.body;
        const hashPassword = await bcrypt.hash(password, 10)
        await Admin.create({
            email,
            password: hashPassword
        })
        res.redirect('/admin');
    } catch(e) {
        console.log(e);
    }
});

module.exports = router;