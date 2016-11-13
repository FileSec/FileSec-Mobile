angular.module('starter.services', ['btford.socket-io'])

.service('FileSocket', function (socketFactory) {
  var fileSocket = io.connect("http://557d3359.ngrok.io:80");

  fileSocket = socketFactory({
    ioSocket: fileSocket
  });

  return fileSocket;
})

.service('SocketService', function (FileSocket, $state) {
  var service = {};
  service.authenticated = false;

  service.authenticate = function(userAuth) {
    FileSocket.emit("user.auth", userAuth);
    service.authenticated = true; 
  };

  service.sendPinAttempt = function(attempt) {
    FileSocket.emit("pin.attempt", attempt);
  };

  FileSocket.on("pin.request", function() {
    $state.go('pin');
  });

  FileSocket.on("fail.pin", function(errorCode) {
    console.log("Error " + errorCode + ": Failed to Authenticate with Correct Pin");
  });

  FileSocket.on("key.request", function(fileInfo) {
    console.log(fileInfo);
    var hashCode = function(str) {
      var hash = 0, i, chr, len;
      if (str.length === 0) return hash;
      for (i = 0, len = str.length; i < len; i++) {
        chr   = str.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
      }
      console.log("Hash: " + hash);
      return hash;
    };
    //Creating publicKey using hashing algorithm
    FileSocket.emit("key.send", hashCode(fileInfo));
  });

  return service;
});