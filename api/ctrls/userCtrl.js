var mongoose = require('mongoose');
var Q = require('q');
var User = mongoose.model('User', require('../models/userSchema.js'));
// var Sub = mongoose.model('Sub', require('../models/subSchema.js'));
module.exports = {
  findOrCreate: function(profile){
    var def = Q.defer();
    var query = [];
    var update = {};
    if (profile.email || profile._json.email) { query.push( { 'email': profile.email || profile._json.email } );
                                                update.email = profile.email || profile._json.email; }
    if (profile.provider === 'google')        { query.push({'googleId': profile.id});
                                                update.googleId = profile.id; }
    if (profile.provider === 'facebook')      { query.push({'facebookId': profile.id});
                                                update.facebookId = profile.id; }
    if (profile.provider === 'twitter')       { query.push({'twitterId': profile.id});
                                                update.twitterId = profile.id; }

// console.log('query: ', query);
// console.log('update: ', update);
    User.findOneAndUpdate({ $or: query }, update, {new: true}, function(updateErr, user){
// console.log('--- USERCTRL LINE 21 ---- ', user);
      if (!user) {
        var newUserObj = {};
        if (profile.email || profile._json.email) newUserObj.email = profile.email || profile._json.email;
        if (profile.provider === 'google')        newUserObj.googleId = profile.id;
        if (profile.provider === 'facebook')      newUserObj.facebookId = profile.id;
        if (profile.provider === 'twitter')       newUserObj.twitterId = profile.id;
        console.log('newUserObj: ', newUserObj);
        User.create(newUserObj, function(createErr, newUser){
          def.resolve(newUser);
        })
      };
      def.resolve(user);
    })
    return def.promise;
  }
, retrieve: function(req, res){
    if (!req.user) return res.status(500).send('no authenticated user');
    var query = {};
    if (req.user && req.user.googleId) query.googleId = req.user.googleId;
    if (req.user && req.user.facebookId) query.facebookId = req.user.facebookId;
    if (req.user && req.user.twitterId) query.twitterId = req.user.twitterId;
    User.findOne(query)
    .exec().then(function(user){
      if (!user) {
        return res.status(500).send('user not found');
      }
      return res.status(200).json(user);
    })
  }
, update: function(req, res){
    User.findByIdAndUpdate(req.params.user_id, {subs: req.body.newMySubs}, {new: true}, function(err, updatedUser){
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(200).json(updatedUser);
    })
  }
, remove: function(req, res){
    User.findByIdAndRemove(req.params.user_id, function(err){
      if (err) return res.status(500).json(err);
      return res.status(200).json();
    })
  }
, mail: function(){
    var def = Q.defer();
    User.findOne({})
    .exec().then(function(user){
      def.resolve(user);
    });
    return def.promise;
  }
};
