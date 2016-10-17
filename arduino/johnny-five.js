'use strict';

import five from 'johnny-five';

/**
 * Init function for arduino Board
 * 
 * @export
 */
export function init() {
  // Initialize Board
  var Board = new five.Board();
}

/**
 * Round value to 1 digit
 * 
 * @param {any} value
 * @returns int round value
 */
function round(value) {
  result = parsInt(value);
  return (!isNan(result) ? Math.round(value * 10) / 10 : value);
}

