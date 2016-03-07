var Restaurant = require('../models/restaurantModel.js')
var DeliveryAPIService = require('./client/deliveryAPI.js')

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
	},

	findByAddress: function (address, callback) {
		DeliveryAPIService.findRestaurantsByAddress(address, function (err, restaurants) {
			callback(err, restaurants)
		})
	},

	findMenu: function (merchantId, callback) {
		DeliveryAPIService.findMenu(merchantId, function (err, menu) {
			callback(err, menu)
		})
	}

};

module.exports = RestaurantService