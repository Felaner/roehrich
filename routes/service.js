'use strict'

const {Router} = require('express');
const router = Router();
const fs = require('fs');

router.get('/', (req, res) => {
    res.render('service', {
        title: 'Услуга №1',
        isService: true
    });
});

module.exports = router;