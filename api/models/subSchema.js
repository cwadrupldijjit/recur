var mongoose = require('mongoose');
module.exports = new mongoose.Schema({
  name: {type: String, required: true, unique: true}
, cost: {type: Number, required: true}
, color: {type: String}
, url: {type: String}
});