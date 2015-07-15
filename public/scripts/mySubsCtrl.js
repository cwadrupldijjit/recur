angular.module('recur')
.controller('mySubsCtrl', function($scope, mySubs, getSubs, mainService){

  $scope.mySubs = mySubs.subs;
  $scope.subs = hideMySubs(getSubs);
  function hideMySubs(subs){
    for (var i = 0; i < subs.length; i++) {
      var match = mySubs.indexOf(subs[i]);
      if (match != -1) {subs.splice(i, 1)};
    };
  };
  $scope.mySubsUpdate = [];
  
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
