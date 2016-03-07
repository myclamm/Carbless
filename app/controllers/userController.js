var UserService = require('../services/userService.js')
var AuthenticateService = require('../services/authenticateService.js')

var UserController = {

	findAll: function(req, res, next) {
		UserService.findAll(function(err, users){
			if(err){
				console.log('error!', err)
				res.send(err);
			}
			res.json(users)
		})
	},

	findByName: function(req, res, next) {
	  UserService.findByName(req.params.name, function(err, users){
	    if(err){
	      console.log('error!', err)
	      res.send(err);
	    }
	    res.json(users)
	  });
	},

	create: function(req, res, next) {
		UserService.create(req.body, function(err, token) {
			if(err){
				console.log('could not create user', err)
				res.send(err);
			}
			res.json(token)
		})
	},

	login: function (req, res, next) {
		UserService.login(req.body, function(err, tokenResponse) {
			if(err){
				console.log('could not login user', err)
				res.send(err);
			}
			res.json(tokenResponse)
		})

	},

	createAddress: function (req, res, next) {
		var userId = req.headers.userid
		var authToken = req.headers.authorization

		UserService.createAddress(userId, authToken, req.body, function (err, addressInfo) {
			if(err){
				console.log('could not create new address', err)
				res.send(err);
			}
			res.json(addressInfo)
		})
	},
	
	///////////////////////////////////////////////////////////////////////
	// EDIT ADDRESS IS REDUNDANT BECAUSE CREATE ADDRESS DOES THE SAME THING
	///////////////////////////////////////////////////////////////////////
	// editAddress: function (req, res, next) {
	// 	var userId = req.headers.userid
	// 	var authToken = req.headers.authorization

	// 	UserService.editAddress(userId, authToken, req.body, function (err, addressInfo) {
	// 		if(err){
	// 			console.log('could not edit user address', err)
	// 			res.send(err);
	// 		}
	// 		res.json(addressInfo);
	// 	})
	// },

	getAddress: function (req, res, next) {
		UserService.getAddress(req.headers.userid, req.headers.authorization, function (err, addressInfo) {
			if(err){
				console.log('could not edit user address', err)
				res.send(err);
			}
			res.json(addressInfo)
		})
	}

};

module.exports = UserController