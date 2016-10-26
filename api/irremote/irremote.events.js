'use strict';

import {EventEmitter} from 'events';
var IrRemoteEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
IrRemoteEvents.setMaxListeners(0);

export function emit(event, data) {
  IrRemoteEvents.emit(event, data);
}

export default IrRemoteEvents;