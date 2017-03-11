'use strict';

import {
  Router
}
from 'express';
import * as controller from './weather.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();

router.get('/indoorTemp/last', auth.isAuthenticated(), controller.getLastIndoorTemp);
router.get('/indoorTemp/:start/:end/extreme', auth.isAuthenticated(), controller.getExtremeIndoorTemp);
router.get('/outdoorTemp/last', auth.isAuthenticated(), controller.getLastOutdoorTemp);
router.get('/outdoorTemp/:start/:end/extreme', auth.isAuthenticated(), controller.getExtremeOutdoorTemp);
router.get('/pressure/last', auth.isAuthenticated(), controller.getLastPressure);
router.get('/pressure/:start/:end/extreme', auth.isAuthenticated(), controller.getExtremePressure);
router.get('/:start/:end', auth.isAuthenticated(), controller.search);

module.exports = router;