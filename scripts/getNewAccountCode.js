var request = require('request');
var config = require('../config.js');
var cheerio = require('cheerio');
var https = require('https');

//Request New Account Creation Page

request.get({url:"https://www.delivery.com/third_party/account/create?client_id="+config.deliveryAPIClientId+"&redirect_uri=http://carblessapp.com&response_type=code&scope=global&state=state&rand="+Date.now(),encoding:'utf8'}, function (err, res, body) {
	if(err){
		console.log('error',err)
	}
	if (!err && res.statusCode == 200) {
		var $ = cheerio.load(body);		
		//Retrieve Account Creation Code
		var code = $('form').children()[0].attribs.value

		//Create new account, using Account Creation Code
		request.post('https://www.delivery.com/api/customer/account', {
			form: {
				client_id : config.deliveryAPIClientId,
				code : code,
				first_name : 'Michael',
				last_name : 'Lam',
				email : 'sdafddadddrdadfddddfddddadddftdddfrrddds@gmail.com',
				password : 12345,
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
			}
			var response = JSON.parse(body)

			//If creation fails, log failure response
			if (!response.user) {
				console.log('create new user failed: ',response.message[0].code)
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
						console.log('error',err);
					} else {

						//If token retrieval success, grab access_token and refresh_token
						console.log(JSON.parse(body))
					}
				})


			}
			//{"message":[{"code":"acct_dupe_email","user_msg":"An account already exists for sdafddas@gmail.com.","dev_msg":"An account already exists for sdafddas@gmail.com."}]}
		})
	}
})

 
