angular.module('starter.services', ['btford.socket-io'])

.service('FileSocket', function (socketFactory) {
  var fileSocket = io.connect("http://10.105.167.101:80");

  fileSocket = socketFactory({
    ioSocket: fileSocket
  });

  return fileSocket;
});