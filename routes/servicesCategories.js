'use strict'

const {Router} = require('express');
const router = Router();
const fs = require('fs');

router.get('/', (req, res) => {
    res.render('servicesCategories', {
        title: 'Услуги',
        isServicesCategories: true
    });
});

module.exports = router;