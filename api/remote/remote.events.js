/**
 * Remote model events
 */

'use strict';

import {EventEmitter} from 'events';
import Remote from './remote.model';
var RemoteEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
RemoteEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Remote.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    RemoteEvents.emit(event + ':' + doc._id, doc);
    RemoteEvents.emit(event, doc);
  }
}

export default RemoteEvents;