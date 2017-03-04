'use strict';

import {
  Router
}
from 'express';
import * as controller from './weather.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();

router.get('/indoorTemp/last', auth.isAuthenticated(), controller.getLastIndoorTemp);
router.get('/outdoorTemp/last', auth.isAuthenticated(), controller.getLastOutdoorTemp);
router.get('/pressure/last', auth.isAuthenticated(), controller.getLastPressure);
router.get('/:start/:end', auth.isAuthenticated(), controller.search);

module.exports = router;