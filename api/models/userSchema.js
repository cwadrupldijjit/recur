var mongoose = require('mongoose');
var subSchema = require('./subSchema.js');
module.exports = new mongoose.Schema({
  googleId: {type: String}
, facebookId: {type: String}
, twitterId: {type: String}
, email: {type: String}
, subs: [subSchema]
, lastNotified: {type: Date, required: true, default: Date.now} 
});


// {
//   "googleId": ""
// , "facebookId": "mikkelrd"
// , "twitterId": ""
// , "email": "mrd@gmail.com"
// , "subs": [
//     {
//       "name": "Netflix"
//     , "cost": "9"
//     , "color": "#ff0000"
//     , "url": "www.netflix.com/unsubscribe"
//     }
//   , {
//       "name": "Hulu"
//     , "cost": "8"
//     , "color": "#0000ff"
//     , "url": "www.hulu.com/unsubscribe"
//     }
//   ]
// }