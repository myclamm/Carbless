var RestaurantService = require('../services/restaurantService.js')

var RestaurantController = {

	findAll : function(req, res, next) {
		RestaurantService.findAll(function(err, restaurants){
			if(err){
				console.log('error!', err)
				res.send(err);
			}
			console.log('sending restaurants',restaurants)
			res.json(restaurants);
		});
	},

	create : function(req, res, next) {
		RestaurantService.create(req.body, function (err, restaurant) {
			if (err){
				console.log('error!', err)
		    res.send(err);
			}
		  res.json(restaurant);
		});
	},

	findByAddress: function (req, res, next) {
		var address = req.query.address
		console.log('the address from request',address)
		
		RestaurantService.findByAddress(address, function (err, restaurants) {
			if(err) {
				console.log('error!', err)
				res.send(err);
			} else {
				res.json(restaurants)
			}
		})
	},

	findMenu: function (req, res, next) {
		var merchant = req.params.merchantId
		
		RestaurantService.findMenu(merchant, function (err, menu) {
			if(err) {
				console.log('error!', err)
				res.send(err);
			} else {
				res.json(menu)
			}
		})
	}



};

module.exports = RestaurantController