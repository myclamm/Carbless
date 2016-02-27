var RestaurantCtrl = require('../controllers/restaurantController.js')

module.exports = function(app,router){

  router.route('/restaurant')
    .get(RestaurantCtrl.findAll)

  router.route('/restaurant/create')
    .post(RestaurantCtrl.create)
}