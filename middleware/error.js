const { divide: Divide, product: Product, service: Service } = require('../models/divide')
module.exports = function (req, res, next) {
    Divide.findAll({
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
            res.status(404).render('404', {
                title: 'Страница не найдена',
                services,
                menuDivides,
                divides
            })
        })
    })
}