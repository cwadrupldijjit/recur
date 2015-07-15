angular.module('recur')
.controller('mySubsCtrl', function($scope, currUser, getSubs, mainService){

  $scope.mySubs = currUser.subs;
  $scope.subs = hideMySubs(getSubs);
  function hideMySubs(subs){
    for (var i = 0; i < mySubs.length; i++) {
      for (var j = 0; j < subs.length; j++) {
        if (mySubs[i].name === subs[i].name) {subs.splice(i, 1); i--};
      };
    };
  };
  $scope.mySubsUpdate = [];
  $scope.updateSubs = function(subName){
    for (var i = 0; i < $scope.subs.length; i++) { 
      if ($scope.subs[i].name === subName) {
        var transfer = $scope.subs.splice(i, 1);
        $scope.mySubsUpdate.push(transfer);
      };
    };
    mainService.updateUser($scope.mySubsUpdate, currUser._id).then(function(){mainService.getUser()});
  };
//   $scope.subs = [
//     'Netflix', 'Amazon Instant', 'Aamazon Subscribe & Save', 'Hulu Plus', 'Cable TV', 'HBO', 'Showtime', 'Vudu', 'Flixster', 'Disney Movie Rewards', 'ESPN', 'Pandora', 'Spotify', 'Rdio', 'Rhapsody', 'Apple Music', 'iHeartRadio', 'Amazon Music', 'Google Music', 'Dollar Shave Club', 'Jackthreads', 'Birchbox', 'Popular Science', 'National Geographic'
//   ];
  angular.element(document.querySelectorAll('.save')).on('click', function(){
//     console.log($scope.user);

//     mainService.updateUser($scope.mySubs);
  });

  $scope.addSub = function(newSub){
    mainService.createSub(newSub).then(function(){
      mainService.getSubs().then(function(res){$scope.subs = res});
    });
    $scope.newSub = {};
  };

});
