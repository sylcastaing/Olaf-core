'use strict';

import {
  Router
}
from 'express';
import * as controller from './weather.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();

router.get('/:start/:end', auth.isAuthenticated(), controller.search);

module.exports = router;