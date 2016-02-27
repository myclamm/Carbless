var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
    first_name: String,
    last_name: String,
    email: String,
    password: String,
    admin: Boolean,
    address: {
        "location_id": String,
    	"street": String,
	    "unit_number": String,
	    "city": String,
	    "state": String,
	    "phone": String,
	    "zip_code": String,
	    "company": String, 
	    "cross_streets": String
    }
});

module.exports = mongoose.model('Users', UserSchema);