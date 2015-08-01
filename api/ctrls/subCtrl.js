var mongoose = require('mongoose');
var Sub = mongoose.model('Sub', require('../models/subSchema.js'));
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
module.exports = {
  create: function(req, res){
    if (!req.body.color) req.body.color = getColor(); 
    Sub.create(req.body, function(err, newSub){
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(200).json(newSub);
    })
  }
, retrieve: function(req, res){
    Sub.find({}).exec()
    .then(function(subs, err){
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(200).json(subs);
    })
  }
, update: function(req, res){
    Sub.findByIdAndUpdate(req.params.sub_id, req.body, {new: true}, function(err, updatedSub){
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(200).json(updatedSub);
    })
  }
, remove: function(req, res){
    Sub.findByIdAndRemove(req.params.sub_id, function(err){
      if (err) return res.status(500).json(err);
      return res.status(200).end();
    })
  }
};