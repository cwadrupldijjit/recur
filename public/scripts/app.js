angular.module('recur', ['ngRoute', 'ngAnimate'])
.config(function($routeProvider){
 
  $routeProvider
  .when('/', {
    templateUrl: './templates/land.html'
  , resolve: {
      currUser: function(mainService){
        mainService.getUser();
      }
    , subsList: function(mainService){
        mainService.getSubs();
      }
    }
  })
  .when('/mySubs', {
    templateUrl: './templates/mySubs.html'
  , controller: 'mySubsCtrl'
  , resolve: {
      currUser: function(mainService){
        return mainService.getUser();
      }
    , subsList: function(mainService){
        return mainService.getSubs();
      }
    , routeAuth: function(mainService, $location){
        if (!mainService.isLoggedIn()) $location.path('/'); 
      }
    }
  })
  .otherwise({
    redirectTo: '/'
  })
})

.controller('mainBodyCtrl', function($scope, $location, mainService){

  $scope.whiteText = {'color': '#ffffff'};

  $scope.getLoc = function(){return $location.path()};

  $scope.$watch( mainService.isLoggedIn, function ( newVal, oldVal ) {
    $scope.user = mainService.currentUser();
//     $scope.subs = mainService.subsList();
  });
})