var request = require('request');
var cheerio = require('cheerio');
var config = require.main.require('./config.js');

//Request New Account Creation Page
var deliveryAPIService = {
	findMenu: function (merchantId, callback) {

		request.get({
			url: 'http://www.delivery.com/api/merchant/'+merchantId+'/menu?client_id='+config.deliveryAPIClientId,
		}, function (err, response, body) {
			if(err){
				console.log('error:', err)
				return callback(err, null)
			} else {
				return callback(err, JSON.parse(body))
			}
		})
	},

	findRestaurantsByAddress: function (address, callback) {

		request.get({
			url: 'http://www.delivery.com/api/merchant/search/delivery?client_id='+config.deliveryAPIClientId+'&address=' + address,
		}, function (err, response, body) {
			if(err){
				console.log('error:', err)
				return callback(err, null)
			} else {
				return callback(err, JSON.parse(body))
			}
		})
	},

	createAddress: function (authToken, addressInfo,callback) {
		request.post({
			url:'https://www.delivery.com/api/customer/location',
			headers: {
 		      'Authorization': authToken
		    },	
			form: {   
			    "street": addressInfo.street,  
			    "unit_number": addressInfo.unit_number || null,
			    "city": addressInfo.city    ,
			    "state": addressInfo.state   ,
			    "phone": addressInfo.phone   ,
			    "zip_code": addressInfo.zip_code,
			    "company": addressInfo.company || null,
			    "cross_streets": addressInfo.cross_streets || null
			}
		}, function (err, response, body) {
			if(err){
				console.log('error: ',err)
				return callback(err, null)
			} else {
				return callback(err, JSON.parse(body).location)
			}
		})
	},

	editAddress: function (locationId, authToken, addressInfo,callback) {
		request.post({
			url:'https://www.delivery.com/api/customer/location?location_id='+locationId,
			headers: {
 		      'Authorization': authToken
		    },	
			form: {   
			    "street": addressInfo.street,  
			    "unit_number": addressInfo.unit_number || null,
			    "city": addressInfo.city    ,
			    "state": addressInfo.state   ,
			    "phone": addressInfo.phone   ,
			    "zip_code": addressInfo.zip_code,
			    "company": addressInfo.company || null,
			    "cross_streets": addressInfo.cross_streets || null
			}
		}, function (err, response, body) {
			if(err){
				console.log('error: ',err)
				return callback(err, null)
			} else {
				return callback(err, JSON.parse(body).location)
			}
		})
	},

	getAccessToken: function (loginData, callback) {
		//Retrieve temp token
		request.get({url:"https://www.delivery.com/api/third_party/authorize?client_id="+config.deliveryAPIClientId+"&redirect_uri=http://carblessapp.com&response_type=code&scope=global&state=state&rand="+Date.now(), encoding:'utf8'}, function (err, res, body) {
			//If error, return error
			if(err){
				console.log('error',err)
				return callback({status:'fail', message: err})
			} else {
				//Grab temp token from HTML
				var $ = cheerio.load(body);		
				var _token = $('form').children()[0].attribs.value
				//Request new Access Code
				request.post("https://www.delivery.com/api/third_party/authorize",{
					form: {
						_token: _token,
						username: loginData.email,
						password: loginData.password,
						client_id: config.deliveryAPIClientId,
						redirect_uri:"http://carblessapp.com",
						response_type:"code",
						scope:"global",
						state:"state",
						owner_id:1,
						approve:1
					}
				},function (err, response, body) {
					//If error, return error
					if(err){
						console.log('error:',err)
						return callback({status:'fail', message: err})
					} else {
						//If success, get OAuth Token from Delivery.com
						var authorization_code = body.split("code=")[1].split("&state")[0];
						
						request.post('https://www.delivery.com/api/third_party/access_token', {
							form: {
								client_id : config.deliveryAPIClientId,
								redirect_uri: 'http://carblessapp.com',
								grant_type: 'authorization_code',
								client_secret: config.deliveryAPIClientSecret,
								'code': authorization_code
							}
						}, function (err, httpResponse, body) {
							if(err){
								console.log('error',err);
								return callback({status: 'fail', message: err})
							} else {

								//If token retrieval success, send access_token
								console.log('body',body)
								var access_token = JSON.parse(body).access_token //temporary, return to client
								console.log('access_token',access_token)
								return callback({status: 'success', token: access_token})

							}
						})
					}
				})				
			}

		})
	},

	createUser: function (newUser, callback) {
		//Retrieve Account Creation Code
		request.get(
			{url:"https://www.delivery.com/third_party/account/create?client_id="+config.deliveryAPIClientId+"&redirect_uri=http://carblessapp.com&response_type=code&scope=global&state=state&rand="+Date.now(),encoding:'utf8'}, function (err, res, body) {
			if(err){
				console.log('error',err)
				return callback({status:'fail', message: err})
			}
			if (!err && res.statusCode == 200) {
				var $ = cheerio.load(body);		
				var code = $('form').children()[0].attribs.value

				//Create new account, using Account Creation Code
				request.post('https://www.delivery.com/api/customer/account', {
					form: {
						client_id : config.deliveryAPIClientId,
						code : code,
						first_name : newUser.first_name,
						last_name : newUser.last_name,
						email : newUser.email,
						password : newUser.password,
						redirect_uri: 'http://carblessapp.com',
						response_type: 'code',
						scope: 'global',
						state: 'state',
						owner_id: 1,
						approve: 1
					}
				}, function (err, httpResponse, body) {

					if (err) {
						console.log('error',err);
						return callback({status:'fail', message: err})
					}
					var response = JSON.parse(body)
					console.log(JSON.parse(body))

					//If creation fails, log failure response
					if (!response.user) {
						//////////////////////////////////////////////////
						//TODO: If username already exists in delivery.com but not in our database,
						//either return error to user saying the account already exists, or if the email
						//is a gmail account, just add ".." to the end of their email and create a new account
						//for the user and mark them in the db as having an extra ".." in their deliv.com account
						/////////////////////////////////////////////////// 
						console.log('create new user failed: ',response.message[0].code)
						return callback({status:'fail', message: response.message[0].code})
					} else {

						//If creation success, grab authorization_code
						var customer_id = response.user.customer_id
						var authorization_code = response.redirect_uri.split('code=')[1].split('&')[0]
						console.log('authorization_code:',authorization_code)

						//Get OAuth Token from Delivery.com
						request.post('https://www.delivery.com/api/third_party/access_token', {
							form: {
								client_id : config.deliveryAPIClientId,
								redirect_uri: 'http://carblessapp.com',
								grant_type: 'authorization_code',
								client_secret: config.deliveryAPIClientSecret,
								'code': authorization_code
							}
						}, function (err, httpResponse, body) {
							if(err){
								//////////////////////
								//TODO: delete delivery.com user account if token request fails
								//////////////////////

								console.log('error',err);
								return callback({status: 'fail', message: err})
							} else {

								//If token retrieval success, send access_token
								var access_token = JSON.parse(body).access_token //temporary, return to client
								
								return callback({status: 'success', token: access_token})

							}
						})
					}
				})
			}
		})
	}
}

module.exports = deliveryAPIService


 
