'use strict'

module.exports = (app) =>  {
    const controller = require('./controller');
    const passport = require('passport');  

    app.route('/').get(controller.homepage);
    app.route('/user').get(controller.userhomepage);
    app.route('/admin').get(controller.adminhomepage);
    app.route('/signup').post(controller.signup);
    app.route('/signin').get(controller.signin);
    app.route('/logout').get(controller.logout);
    app.route('/profile').get(controller.profile);
    app.route('/products').get(controller.products);
    app.route('/userproducts').get(controller.userproducts);
    app.route('/to_bag').post(controller.toBag);
    app.route('/bag').get(controller.productsBag);
    app.route('/aboutus').get(controller.aboutus);
    app.route('/useraboutus').get(controller.useraboutus);
    app.route('/payprod').post(controller.payprod);
    app.route('/delprod').post(controller.delprod);
    app.route('/orders').get(controller.orders);
    app.route('/adminusers').get(controller.adminusers);
    //app.route('/users').get(passport.authenticate('jwt', {session: false}), usersController.getAllUsers);

    app.route('*').get(controller.multi);
}  