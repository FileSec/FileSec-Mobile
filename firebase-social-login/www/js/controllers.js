angular.module('starter.controllers', [])

.controller('LoginCtrl', function ($state, $firebaseAuth, $location, $scope) {
  $scope.data = {username: 'redbackthomson@gmail.com', password: 'password'};

  $scope.login = function() {
    firebase.auth().signInWithEmailAndPassword($scope.data.username, $scope.data.password)
      .then(function(result) {
        console.log("Signed in as:", result.uid);
        $state.go('home');
      }).catch(function(error) {
        console.error("Authentication failed:", error);
      });
  };
})

.controller('HomeCtrl', function (FileSocket, SocketService, $scope, $state) {
  var userAuth = {
    deviceType: "mobile",
    userID: firebase.auth().currentUser.uid
  }

  if(!SocketService.authenticated){
    SocketService.authenticate(userAuth);
  }

  $scope.redirect = function() {
    $state.go('pin');
  } 
})

.controller('PinCtrl', function (SocketService, $scope, $state) {
  var pinAttempt = ""; 
  $scope.dispPin = " ";

  $scope.press = function(num) {
    pinAttempt = pinAttempt.concat(num);
    $scope.dispPin = Array(pinAttempt.length+1).join("*");
  };

  $scope.back = function(){
    pinAttempt = pinAttempt.slice(0, -1);
    $scope.dispPin = Array(pinAttempt.length+1).join("*");
  }

  $scope.send = function(){
    SocketService.sendPinAttempt(pinAttempt);
    $state.go('home'); 
  };
});