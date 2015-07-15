angular.module('recur', ['ngRoute'])
.config(function($routeProvider){
  $routeProvider
  .when('/', {
    templateUrl: './templates/land.html'
  })
  .when('/mySubs', {
    templateUrl: './templates/mySubs.html'
  , controller: 'mySubsCtrl'
  , resolve: {
      isAuthed: function(){

      }
    , currUser: function(mainService){
        return mainService.getUser();
      }
    , getSubs: function(mainService){
        return mainService.getSubs();
      }
    }
  })
  .otherwise({
    redirectTo: '/'
  })
})
// .directive('mySubs', function(){
//   return {
// //     scope: {
// //       user: '=',
// //       setUser: '&'
// //     },
//     templateUrl: './templates/mySubs.html',
//     controller: 'mySubsCtrl',
//     link: function (scope, elem, attrs) {
// //       console.log(scope.user);
//       elem.on('click', function(){
// //         scope.resetWeather();
// //         scope.setUser({user: scope.user});
// //         scope.showToggle = !scope.showToggle;
// //         scope.$apply();
//       });
//     }
//   }
// })
.directive('authModal', function(){
  return {
//     scope: {
//     },
    templateUrl: './templates/authModal.html',
    link: function (scope, elem, attrs) {
    }
  }
})