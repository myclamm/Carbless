var UserCtrl = require('../controllers/userController.js');
var mdw = require('./middleware/middleware.js');

module.exports = function(app,router) {
  //////////////////////////////////////////////
  //TODO: Add Route parameter validations
  /////////////////////////////////////////////////
  router.route('/user/create')
  	.post(UserCtrl.create)

  router.route('/user/login') 
  	.post(UserCtrl.login)

  router.route('/user/search/:name')          
  	.get(UserCtrl.findByName)
  
  router.route('/users')
  	.get(UserCtrl.findAll)

  router.route('/user/address')
  	.post(UserCtrl.createAddress)
  	.put(UserCtrl.editAddress) //THIS ENDPOINT IS PROBABLY REDUNDANT
  	.get(mdw.authenticate, UserCtrl.getAddress)

}