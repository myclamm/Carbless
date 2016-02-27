var Restaurant = require('../models/restaurantModel.js')

var RestaurantService = {

	findAll: function (callback) {
		Restaurant.find(function(err, restaurants) {
		    callback(err, restaurants)
		});
	},

	create: function (restaurantData, callback) {
		var restaurant = new Restaurant(restaurantData);      // create a new instance of the Bear model

		restaurant.save(function(err, restaurant) {
	    callback(err, restaurant);
		});
	}

};

module.exports = RestaurantService