'use strict';

import User from '../api/user/user.model';
import chalk from 'chalk';

if (process.env.NODE_ENV === 'production') {
  User.find({
    role: 'admin'
  }).count()
  .then((nb) => {
    if (nb === 0) {
      console.log("No admin, add default admin");

      return User.create({
        provider: 'local',
        role: 'admin',
        name: 'Admin',
        email: 'admin@example.com',
        password: 'admin'
      })
    }

    return null;
  });
}
else {
  User.find({}).remove()
  .then(() => {
    User.create({
      provider: 'local',
      name: 'Test User',
      email: 'test@example.com',
      password: 'test'
    }, {
      provider: 'local',
      role: 'admin',
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin'
    })
    .then(() => {
      console.log(chalk.gray('Finished populating users'));
    });
  });
}

