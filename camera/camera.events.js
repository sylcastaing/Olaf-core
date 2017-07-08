'use strict';

import { EventEmitter } from 'events';
var CameraEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
CameraEvents.setMaxListeners(0);

export function emit(event, data) {
  CameraEvents.emit(event, data);
}

export default CameraEvents;