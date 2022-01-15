'use strict'

const {Router} = require('express');
const router = Router();
const fs = require('fs');
const mailer = require('../mailer/mail');
const request = require('request');
const { divide: Divide, service: Service, product: Product, image: Image } = require('../models/divide')

router.get('/', async (req, res) => {
    await Divide.findAll({
        attributes: ['id', 'name', 'srcImage'],
        include: [{
            model: Product,
            attributes: ['id', 'name', 'price'],
            include: {
                model: Image,
                attributes: ['id', 'srcImage']
            },
            order: ['Image', 'id', 'ASC']
        }]
    }).then(divides => {
        const menuDivides = divides.slice(0, 4)
        const products = divides.slice(0, 6)
        Service.findAll({
            include: {
                model: Image
            }
        }).then(services => {
            const homeServices = services.slice(0, 6)
            res.render('home', {
                title: 'Главная',
                isHome: true,
                services,
                menuDivides,
                products,
                homeServices,
                divides
            });
        }).catch(e => {
            console.log(e)
        })
    }).catch(e => {
        console.log(e)
    })
});

router.post('/', async (req, res) => {
    try {
        if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
            return res.json({"responseError" : "captcha error"});
        }
        const secretKey = "6LcDmBQeAAAAAGk6QMlOIktEREu8S97YRBcSvZ-a";
        const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
        request(verificationURL,function(error,response,body) {
            body = JSON.parse(body);
            if(body.success !== undefined && !body.success) {
                return res.json({"responseError" : "Failed captcha verification"});
            }
            if (!req.body) return res.sendStatus(400);
            const {contactName, contactOrganization, contactContact, contactProduct, contactCount, contactDate, contactAddress} = req.body;
            const message = {
                to: "kirill.deykun1@gmail.com",
                html: `<ul>` +
                    `<li>Имя: ${contactName}</li>` +
                    `<li>Название организации: ${contactOrganization}</li>` +
                    `<li>Контакты: ${contactContact}</li>` +
                    `<li>Товар: ${contactProduct}</li>` +
                    `<li>Количество: ${contactCount}</li>` +
                    `<li>Когда: ${contactDate}</li>` +
                    `<li>Адрес: ${contactAddress}</li>` +
                    `</ul>`,
                subject: 'Новый заказ!'
            };
            mailer(message)
            return res.sendStatus(200);
        });
    } catch(e) {
        console.log(e);
    }
})

module.exports = router;