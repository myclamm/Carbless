var User = require('../models/userModel.js');
var jwt  = require('../components/auth.js').jwt;
var config = require.main.require('./config.js')
var DeliveryAPIService = require('./client/deliveryAPI.js')

var UserService = {

	findAll: function (callback) {
		User.find(function(err, users) {
		  callback(err, users)
		});
	},

	findByName: function (name, callback) {
		User.find({name:name}, function (err, user) {
      callback(err, user);
    });
	},

	login: function (loginData, callback) {
		//Check if user has an account
		User.find({email: loginData.email}, function (err, user) {
			var user = user[0];
			if(!user) {
				console.log('email account does not exist')
				callback(err, {status:'fail', message: 'email account does not exist'})
			} else {
				//If user password is incorrect
				if(!(user.password == loginData.password)) {
					console.log('incorrect password')
					callback(err, {status:'fail', message: 'username or password incorrect'})
				} else {
					//If their password is correct
					//Retrieve access token from delivery.com API
					DeliveryAPIService.getAccessToken(loginData, function (response) {
						callback(err, {userId: user._id, token: response});
					})


				}
			}
		})

	},

	create: function (newUser, callback) {
		User.find({email: newUser.email}, function (err, user) {
			//Check if email already in use
			if (user.length) {
				callback(err, {status:'fail', message: 'user email already exists'})
			} else {
				//If email is unique, create user in database
				User.create(newUser, function(err, user) {
					
					if (err) {
						callback(err, {status:'fail', message:'could not create user'})
					} else {
						//Create delivery.com account for user
						DeliveryAPIService.createUser(newUser, function (response) {
							//If delivery.com request fails, delete user in database and notify
							//client of the error
							if (response.status === 'fail') {
								User.find({email: newUser.email}).remove(function () {
									callback(err, {status: 'fail', message:response.message})
								})
							} else {

								//If response success, send token to user
								callback(err, {userId: user._id, token: response});
							}

						})
					}

				});
				
			}
		})
	},

	createAddress: function (userId, authToken, addressInfo, callback) {
		//Create it new Address on delivery.com
		DeliveryAPIService.createAddress(authToken, addressInfo, function (err, addressData) {
			if(err) {
				console.log('error',err)
				callback(err, {status:'fail', message: err})
			} else {
				//change address in database
				User.findById(userId, function (err, user) {
					if(err){
						callback(err, {status:'fail', message: 'userId does not exist'});
					} else {
						user.address = addressData;
						console.log('user',user)
						user.save(function (err) {
							if(err){
								callback(err, {status:'fail', message:'could not save address info'})
							} else {
								callback(err, user.address)
							}
						})
					}
				})

			}
		}) 
	},

	editAddress: function (userId, authToken, addressInfo, callback) {
		User.findById(userId, function (err, user) {
			if(err){
				callback(err, {stats:'fail', message: 'userId does not exist'})
			} else {
				var locationId = user.address.locationId;
				console.log('locationId',locationId)
				DeliveryAPIService.editAddress(locationId, authToken, addressInfo, function (err, addressData) {
					if(err){
						console.log('could not edit deliv.com address',err)
						callback(err, {status:'fail', message: err})
					} else {
						console.log('API change successful, now changing address in database', addressData)
						user.address = addressData;
						user.save(function (err) {
							if(err){
								callback(err, {status:'fail', message:'could not save address info'})
							} else {
								callback(err, user.address)
							}
						})
					}
				})
			}
		})

	},

	getAddress: function (userId, callback) {
		console.log('userId',userId)
		User.findById(userId, function (err, user) {
			if(err){
				callback(err, {status:'fail', message: 'userId does not exist'}); 
			} else {
				callback(err, user.address)
			}
		})
	}

}

module.exports = UserService