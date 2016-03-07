var UserCtrl = require('../controllers/userController.js');
var mdw = require('./middleware/middleware.js');

module.exports = function(app,router) {
  //////////////////////////////////////////////
  //TODO: Add Route parameter validations
  /////////////////////////////////////////////////
  
  /*
  POST: /user/create
  BODY:
    first_name: String
    last_name: String
    email: String
    password: String
  */
  router.route('/user/create')
  	.post(UserCtrl.create)

  /*
  POST: /user/login
  BODY:
    email: STRING
    password: STRING
  */
  router.route('/user/login') 
  	.post(UserCtrl.login)

  /*
  GET: /user/search/:name
  */
  router.route('/user/search/:name')          
  	.get(UserCtrl.findByName)

  /*
  GET: /users
  */
  router.route('/users')
  	.get(UserCtrl.findAll)

  /*
  POST: /user/address
  HEADER: 
    userid:
    authorization:
  BODY:
    street:  STRING 
    unit_number: STRING optional
    city: STRING
    state: STRING
    phone: STRING
    zip_code: STRING
    company: STRING optional
    cross_streets: STRING optional
  */
  router.route('/user/address')
  	.post(UserCtrl.createAddress)
  	.get(mdw.authenticate, UserCtrl.getAddress)

}