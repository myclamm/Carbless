var RestaurantCtrl = require('../controllers/restaurantController.js')

module.exports = function(app,router){

  router.route('/restaurant')
    .get(RestaurantCtrl.findAll)

  router.route('/restaurant/create')
    .post(RestaurantCtrl.create)

  router.route('/restaurant/find')
  	.get(RestaurantCtrl.findByAddress)

  router.route('/restaurant/menu/:merchantId')
  	.get(RestaurantCtrl.findMenu)
}