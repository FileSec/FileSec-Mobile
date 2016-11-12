angular.module('starter.controllers', [])

.controller('LoginCtrl', function ($state, $firebaseAuth, $location, $scope) {
  this.loginWithGoogle = function loginWithGoogle() {
    $firebaseAuth().$signInWithPopup('google')
      .then(function(result) {
        console.log("Signed in as:", result.user.uid);
        $state.go('home');
      }).catch(function(error) {
        console.error("Authentication failed:", error);
      });
  };
})

.controller('HomeCtrl', function (FileSocket, $scope, $state, $stateParams) {
  var attempt = $stateParams.attempt;

  var userAuth = {
    deviceType: "mobile",
    userID: firebase.auth().currentUser.uid
  }

  if (angular.isUndefined(attempt) || attempt == null){
    FileSocket.emit("user.auth", userAuth);
  }
  else{
    FileSocket.emit("pin.attempt", attempt);
  }

  FileSocket.on("pin.request", function() {
    $state.go('pin');
  });

  FileSocket.on("fail.pin", function(errorCode) {
    console.log("Error " + errorCode + ": Failed to Authenticate with Correct Pin");
  });

  FileSocket.on("file.info", function(fileInfo) {
    var hashCode = function(str) {
      var hash = 0, i, chr, len;
      if (str.length === 0) return hash;
      for (i = 0, len = str.length; i < len; i++) {
        chr   = str.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
      }
      return hash;
    };
    //Creating publicKey using hashing algorithm
    FileSocket.emit("key.send", hashCode(fileInfo));
  });

  $scope.redirect = function() {
    $state.go('pin');
  }
})

.controller('PinCtrl', function (FileSocket, $scope, $state) {
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
    //console.log("pinAttempt sent: " + pinAttempt);
    $state.go('home', { 'attempt' : pinAttempt }); 
  };
});