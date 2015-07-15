angular.module('recur')
.factory('mainService', function($q, $http){
  return {
//     completeUser: function(login){
//       $http({
//         method: 'POST'
//       , url: 'http://localhost:8080/api/user/'
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
    getUser: function(){
      var def = $q.defer();
      $http({
        method: 'GET'
      , url: 'http://dev.recur.com:8080/api/user/'
//       , data: {login: login}
      })
      .then(function(res){
        def.resolve(res.data);
      })
      return def.promise;
    }

  , updateUser: function(newSubs, uid){
      var def = $q.defer();
      $http({
        method: 'PUT'
      , url: 'http://localhost:8080/api/user/' + uid
      , data: {newSubs: newSubs}
      })
      .then(function(res){
        def.resolve(res.data);
      })
      return def.promise;
    }

  , deleteUser: function(login){
      var def = $q.defer();
      $http({
        method: 'DELETE'
      , url: 'http://localhost:8080/api/user/' + login.id
      , data: {login: login}
      })
      .then(function(res){
        def.resolve(res.data);
      })
      return def.promise;
    }

  , createSub: function(newSub){
      var def = $q.defer();
      $http({
        method: 'POST'
      , url: 'http://dev.recur.com:8080/api/sub/'
      , data: newSub
      })
      .then(function(res){
        var createdSub = res.data;
        def.resolve(createdSub);
      })
      return def.promise;
    }

  , getSubs: function(){
      var def = $q.defer();
      $http({
        method: 'GET'
      , url: 'http://dev.recur.com:8080/api/sub/'
      })
      .then(function(res){
        def.resolve(res.data);
      })
      return def.promise;
    }

  , updateSub: function(){

    }

  , deleteSub: function(){

    }
     
  }
})