var mongoose = require('mongoose');
var Sub = mongoose.model('Sub', require('../models/subSchema.js'));
module.exports = {
  create: function(req, res){
    Sub.create({
      name: req.body.name
    , cost: req.body.cost
    , color: req.body.color
    , url: req.body.url
    }, function(err, newSub){
      if (err) {
        return res.status(500).end(err);
      }
      return res.status(200).json(newSub);
    })
  }
, retrieve: function(req, res){
    Sub.find({}).exec()
    .then(function(subs){
      if (!subs) {
        return res.status(500).end('subs could not be found');
      }
      return res.status(200).json(subs);
    })
  }
, update: function(req, res){
    Sub.findByIdAndUpdate(req.params.sub_id, req.body, {new: true}, function(err, updatedSub){
      if (err) {
        return res.status(500).end(err);
      }
      return res.status(200).json(updatedSub);
    })
  }
, remove: function(req, res){
    Sub.findByIdAndRemove(req.params.sub_id, function(err){
      if (err) return res.status(500).end(err);
      return res.status(200).end();
    })
  }
};