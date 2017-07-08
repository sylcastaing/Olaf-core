'use strict';

import CameraEvents from './camera.events';

export function register(socket) {
  var listener = createListener('camera', socket);

  CameraEvents.on('camera', listener);
  socket.on('disconnect', removeListener('camera', listener));
}

function createListener(event, socket) {
  return function(data) {
    socket.emit(event, data);
  };
}

function removeListener(event, listener) {
  return function() {
    CameraEvents.removeListener(event, listener);
  };
}