'use strict'

const {Router} = require('express');
const router = Router();
const fs = require('fs');
const { divide: Divide, product: Product, service: Service } = require('../models/divide')
const mailer = require('../mailer/mail');

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
    try {
        let Model = {},
            messageBody = '',
            contactsBody = '';
        console.log(Object.assign(Model, req.body))
        Object.keys(Model).forEach((el) => {
            if (el === 'customer') {
                const contacts = Model[el]
                contactsBody += `<li>Имя: ${contacts['name']}<br>Номер телефона: ${contacts['phone']}<br>E-mail: ${contacts['email']}</li><br>`
            } else {
                messageBody += '<li>'
                Model[el].forEach((el, i) => {
                    if (i === 0) {
                        messageBody += `Товар: ${el}<br>`
                    } else if (i === 1) {
                        messageBody += `Количество: ${el} шт.<br>`
                    } else if (i === 2) {
                        messageBody += `Стоимость: ${el} руб.<br>`
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
        // });
    } catch(e) {
        console.log(e);
    }
})

module.exports = router;