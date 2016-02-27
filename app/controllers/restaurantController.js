var RestaurantService = require('../services/restaurantService.js')

var RestaurantController = {

	findAll : function(req, res) {
		RestaurantService.findAll(function(err, restaurants){
			if(err){
				console.log('error!', err)
				res.send(err);
			}
			console.log('sending restaurants',restaurants)
			res.json(restaurants);
		});
	},

	create : function(req, res) {
		RestaurantService.create(req.body, function (err, restaurant) {
			if (err){
				console.log('error!', err)
		    res.send(err);
			}
		  res.json(restaurant);
		});
		}

};

module.exports = RestaurantController