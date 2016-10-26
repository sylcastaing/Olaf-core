'use strict';

import irRemote from './ir-remote';
import johnnyFive from './johnny-five';

function init() {
  irRemote();
  johnnyFive();
}

export default init;