'use strict';

import CameraEvents from './camera.events';

export function register(socket) {
  var listener = createListener('camera', socket);

  CameraEvents.on('camera', listener);
  socket.on('disconnect', removeListener('camera', listener));

  socket.on('join-camera', () => {
    socket.join('camera');
  });

  socket.on('leave-camera', () => {
    socket.leave('camera');
  });
}

function createListener(event, socket) {
  return function(data) {
    socket.in('camera').emit(event, data);
  };
}

function removeListener(event, listener) {
  return function() {
    CameraEvents.removeListener(event, listener);
  };
}