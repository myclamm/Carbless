var RestaurantCtrl = require('../controllers/restaurantController.js')

module.exports = function(app,router){

  router.route('/restaurant')
    .get(RestaurantCtrl.findAll)

  router.route('/restaurant/create')
    .post(RestaurantCtrl.create)

  /*
  GET /restaurant/find?address=219%206th%20st,94103
  */
  router.route('/restaurant/find')
  	.get(RestaurantCtrl.findByAddress)

  /*
  GET /restaurant/menu/67423
  */
  router.route('/restaurant/menu/:merchantId')
  	.get(RestaurantCtrl.findMenu)
}