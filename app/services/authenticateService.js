var User = require('../models/userModel.js');
var jwt  = require('../components/auth.js').jwt;
var config = require.main.require('./config.js')

var AuthenticateService = {
	authenticate: function (data, callback) {
		User.findOne({
			name: data.name
		}, function(err, user) {
			if(!user) {
				callback(err, {success:false, message:"Authentication failed, user not found!"})
			} else {
				//Check password
				if(user.password != data.password) {
					callback(err, {success:false, message:"Authentication failed. Wrong password."})
				} else {

					//If password is correct, create token
					var token = jwt.sign(user, config.secret, {
						expiresIn: 86400 //expires in 1 day
					});

					callback(err, {
						success: true,
						message: "Here's your token, have fun",
						token: token
					});
				}

			}
		})
	}

};

module.exports = AuthenticateService