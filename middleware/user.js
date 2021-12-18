const Admin = require('../models/admin');

module.exports = async function(req, res, next) {
    if (!req.session.user) {
        return next()
    }

    req.user = await Admin.findByPk(req.session.user.id)
    next()
}