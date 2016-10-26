'use strict';

import IrRemoteEvents from './irremote.events';

export function register(socket) {
  var listener = createListener('irin', socket);

  IrRemoteEvents.on('irin', listener);
  socket.on('disconnect', removeListener('irin', listener));
}

function createListener(event, socket) {
  return function(data) {
    socket.emit(event, data);
  };
}

function removeListener(event, listener) {
  return function() {
    IrRemoteEvents.removeListener(event, listener);
  };
}