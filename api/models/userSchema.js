var mongoose = require('mongoose');
var subSchema = require('./subSchema.js');
module.exports = new mongoose.Schema({
  googleId: {type: String},
  facebookId: {type: String},
  twitterId: {type: String},
  email: {type: String},
  subs: [subSchema],
  lastNotified: {type: Date, required: true, default: Date.now}
});
