angular.module('recur')
.controller('mainCtrl', function($scope, mainService){

  $scope.landShow = true;
  $scope.test = 'testtesttest'
  mainService.getUser().then(function(res){$scope.user = res;});

})