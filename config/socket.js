'use strict';

/**
 * Socket.io configuration
 */

import config from './environment';

// When the user disconnects
function onDisconnect(socket) {

}

function onConnect(socket) {
  socket.on('info', data => {
    socket.log(JSON.stringify(data, null, 2));
  });

  require('../api/weather/weather.socket').register(socket);
  require('../api/remote/remote.socket').register(socket);
  require('../api/irremote/irremote.socket').register(socket);
}

export default function(socketio) {

  if (process.env.NODE_ENV === 'production') {
      socketio.use(require('socketio-jwt').authorize({
      secret: config.secrets.session,
      handshake: true
    }));
  }

  socketio.on('connection', function(socket) {
    socket.address = socket.request.connection.remoteAddress + ':' + socket.request.connection.remotePort;

    socket.connectedAt = new Date();

    socket.log = function(data) {
      console.log(`SocketIO ${socket.nsp.name} [${socket.address}]`, data);
    };

    socket.on('disconnect', () => {
      onDisconnect(socket);
      socket.log('DISCONNECTED');
    });

    onConnect(socket);
    socket.log('CONNECTED');
  });
}