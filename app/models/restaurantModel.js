var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var RestaurantSchema   = new Schema({
    name: String,
    info: String,
    cuisine: String,
});

module.exports = mongoose.model('Restaurants', RestaurantSchema);