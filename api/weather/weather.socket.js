'use strict';

import { default as WeatherEvents, events } from './weather.events';

export function register(socket) {
  // Bind model events to socket events
  for (var i in events) {

    var listener = createListener('weather:' + events[i], socket);
    WeatherEvents.on('weather:' + events[i], listener);

    socket.on('disconnect', removeListener('weather:' + events[i], listener));
  }

  socket.on('join-weather', () => {
    socket.join('weather');
  });

  socket.on('leave-weather', () => {
    socket.leave('weather');
  });
}

function createListener(event, socket) {
  return function (doc) {
    socket.in('weather').emit(event, doc);
  };
}

function removeListener(event, listener) {
  return function () {
    WeatherEvents.removeListener(event, listener);
  };
}