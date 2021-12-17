'use strict'

const {Router} = require('express');
const router = Router();
const fs = require('fs');

router.get('/', (req, res) => {
    res.render('about', {
        title: 'О нас',
        isAbout: true
    });
});

module.exports = router;