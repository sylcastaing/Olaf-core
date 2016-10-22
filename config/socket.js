'use strict';

/**
 * Socket.io configuration
 */

// When the user disconnects
function onDisconnect(socket) {

}

function onConnect(socket) {
  socket.on('info', data => {
    socket.log(JSON.stringify(data, null, 2));
  });

  // TODO;
  //require('')
}

export default function(socketio) {

  socket.address = socket.request.connection.remoteAddress + ':' + socket.request.connection.remotePort;
  socket.connectedAt = new Date();

  socket.log = function(data) {
    console.log('SocketIO ${socket.nsp.name} [${socket.address}]', data);
  }

  socket.on('disconnect', () => {
    onDisconnect(socket);
    socket.log('DISCONNECTED');
  });

  onConnect(socket);
  socket.log('CONNECTED');
}