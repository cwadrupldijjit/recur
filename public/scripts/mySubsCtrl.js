angular.module('recur')
.controller('mySubsCtrl', function($scope, $location, currUser, subsList, mainService){

  $scope.email = currUser.email;

  $scope.subsHidden = [];
  var hideMySubs = function(subs){
    for (var i = 0; i < $scope.mySubs.length; i++) {
      for (var j = 0; j < subs.length; j++) {
        if ($scope.mySubs[i].name === subs[j].name) {
          var transfer = subs.splice(j, 1)[0];
          $scope.subsHidden.push(transfer); 
          j--;
        };
      };
    };
    return subs;
  };

  $scope.mySubs = currUser.subs.slice();
  $scope.subs = hideMySubs(subsList.slice());

  $scope.sendToMySubs = function(subName){
    $scope.mySubsChanged = true;
    for (var i = 0; i < $scope.subs.length; i++) { 
      if ($scope.subs[i].name === subName) {
        var transfer = $scope.subs.splice(i, 1)[0];
        $scope.subsHidden.push(transfer);
        var subToAdd = {
          name: transfer.name
        , cost: transfer.cost
        , url: transfer.url
        , color: transfer.color
        };
        $scope.mySubs.push(subToAdd);
        i--;
      };
    };
  };

  $scope.sendToSubs = function(subName){
    $scope.mySubsChanged = true;
    for (var i = 0; i < $scope.mySubs.length; i++) { 
      if ($scope.mySubs[i].name === subName) {
        $scope.mySubs.splice(i, 1)[0];
        i--;
      };
    };
    for (var i = 0; i < $scope.subsHidden.length; i++) { 
      if ($scope.subsHidden[i].name === subName) {
        var transfer = $scope.subsHidden.splice(i, 1)[0];
        $scope.subs.push(transfer);
        i--;
      };
    };
  };

  $scope.updateMySubs = function(update){
    mainService.updateUser(update, $scope.user._id).then(function(res){
      $scope.mySubs = res.subs;
      $scope.mySubsChanged = false;
    });
  };

  $scope.addSub = function(newSub){
    if (!newSub.status) {
      delete newSub.status;
      mainService.createSub(newSub).then(function(res){
        $scope.subs.push(res);
      });
    }
    $scope.newSub = {status: ''};
  };

});
