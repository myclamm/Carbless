var Routes = {}

var Users = require('./user.js')
var Restaurants = require('./restaurant.js')

module.exports = function(app,router){ 
  //Adds routes to the express router
  Users(app,router);
  Restaurants(app,router);
}