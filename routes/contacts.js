'use strict'

const {Router} = require('express');
const router = Router();
const fs = require('fs');

router.get('/', (req, res) => {
    res.render('contacts', {
        title: 'Контакты',
        isContacts: true
    });
});

module.exports = router;