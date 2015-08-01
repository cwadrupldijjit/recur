angular.module('recur')
.factory('mainService', function($q, $http){

  var factory = {};
  var currUser = null;
  var subsList = null;

  factory.isLoggedIn = function(){
    if (currUser) return true;
    return false; 
  }

  factory.logout = function(){currUser = null}

  factory.currentUser = function(){return currUser};

  factory.subsList = function(){return subsList}

  factory.getUser = function (){
    var def = $q.defer();
    $http({
      method: 'GET'
    , url: 'http://dev.recur.com:8080/api/user/'
    })
    .then(function(res, err){
      def.resolve(res.data);
      if (!err) currUser = res.data;
    })
    return def.promise;
  }

  factory.updateUser = function(newMySubs, uid){
    var def = $q.defer();
    $http({
      method: 'PUT'
    , url: 'http://dev.recur.com:8080/api/user/' + uid
    , data: {newMySubs: newMySubs}
    })
    .then(function(res){
      def.resolve(res.data);
    })
    return def.promise;
  }

  factory.deleteUser = function(login){
    var def = $q.defer();
    $http({
      method: 'DELETE'
    , url: 'http://dev.recur.com:8080/api/user/' + login.id
    , data: {login: login}
    })
    .then(function(res){
      def.resolve(res.data);
    })
    return def.promise;
  }

  factory.createSub = function(newSub){
    var def = $q.defer();
    $http({
      method: 'POST'
    , url: 'http://dev.recur.com:8080/api/sub/'
    , data: newSub
    })
    .then(function(res){
      def.resolve(res.data);
    })
    return def.promise;
  }

  factory.getSubs = function (){
    var def = $q.defer();
    $http({
      method: 'GET'
    , url: 'http://dev.recur.com:8080/api/sub/'
    })
    .then(function(res, err){
      if (!err) subsList = res.data;
      def.resolve(res.data);
    })
    return def.promise;
  }

  factory.updateSub = function(){}
  factory.deleteSub = function(){}


  return factory;
})


//     completeUser: function(login){
//       $http({
//         method: 'POST'
//       , url: 'http://dev.recur.com:8080/api/user/'
//       , data: {
//           googleId: googleId
//         , facebookId: facebookId
//         , twitterId: twitterId
//         , email: login.email
//         }
//       })
//       .then(function(res){
//         def.resolve(res.data);
//       })
//       return def.promise;    
//     }