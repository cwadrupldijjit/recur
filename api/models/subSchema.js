var mongoose = require('mongoose');
var colors = [
  '#DD0000' //red
, '#EE9900' //orange
// , '#EECC00' //yellow
, '#00AA00' //green
, '#0077FF' //blue
, '#888888' //gray
// , '#774400' //brown
];
function getColor(){
  var i = Math.floor(Math.random() * colors.length);
//   console.log(i);
  return colors[i]; 
}
module.exports = new mongoose.Schema({
  name: {type: String, required: true}
, cost: {type: Number, required: true}
, color: {type: String, default: getColor()}
, url: {type: String}
});