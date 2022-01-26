'use strict'

const {Router} = require('express');
const router = Router();
const fs = require('fs');
const { divide: Divide, product: Product, service: Service } = require('../models/divide')
const mailer = require('../mailer/mail');
const request = require('request')

router.get('/', async (req, res) => {
    await Divide.findAll({
        attributes: ['id', 'name', 'srcImage'],
        include: [{
            model: Product,
            attributes: ['id', 'name']
        }]
    }).then(divides => {
        Service.findAll({
            attributes: ['id', 'name']
        }).then(services => {
            const menuDivides = divides.slice(0, 4)
            res.render('cart', {
                title: 'Корзина',
                isCart: true,
                services,
                menuDivides,
                divides
            });
        })
    })
});

router.post('/', async (req, res) => {
    if (req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
        return res.sendStatus(501);
    }
    const secretKey = "6Le1XSkeAAAAAGO5lUqZfNTkBwqmoVsyOwuS7nOK";
    const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
    request(verificationURL, function (error, response, body) {
        body = JSON.parse(body);
        if (body.success !== undefined && !body.success) {
            return res.sendStatus(501);
        }
        try {
            let Model = {},
                messageBody = '',
                contactsBody = '';
            console.log(Object.assign(Model, req.body))
            Object.keys(Model).forEach((el) => {
                if (el === 'customer') {
                    const contacts = Model[el]
                    contactsBody += `<li>Имя: ${contacts['name']}<br>Номер телефона: ${contacts['phone']}<br>E-mail: ${contacts['email']}</li><br>`
                } else if (el !== 'g-recaptcha-response') {
                    messageBody += '<li>'
                    Model[el].forEach((el, i) => {
                        if (i === 0) {
                            messageBody += `Товар: ${el}<br>`
                        } else if (i === 1) {
                            messageBody += `Количество: ${el} шт.<br>`
                        } else if (i === 2) {
                            messageBody += `Стоимость: ${el} руб.<br>`
                        } else if (i === 3) {
                            messageBody += `${el}<br>`
                        }
                    })
                    messageBody += '</li><br>'
                }
            })
            const message = {
                to: "kirill.deykun1@gmail.com",
                html: `<ul>` +
                    '<h3>Заказчик</h3>' +
                    `${contactsBody}` +
                    '<h3>Список товаров</h3>' +
                    `${messageBody}` +
                    `</ul>`,
                subject: 'Новый заказ!'
            };
            mailer(message)
            return res.sendStatus(200);
        } catch (e) {
            console.log(e)
        }
    })
})

module.exports = router;