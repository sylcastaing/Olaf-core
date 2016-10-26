'use strict';

import SerialPort from 'serialport';
import config from '../config/environment';
import chalk from 'chalk';

export default function init() {

  // Initialize connection
  var port = new SerialPort(config.arduinoPorts.irRemote, {
    parser: SerialPort.parsers.readline('\n')
  });

  port.on('error', (error) => {
    console.log(chalk.red(error));
  });

  port.on('open', () => {
    console.log(chalk.blue("Connection with irRemote initialized"));
  });

  port.on('data', (data) => {
    console.log(data);
  });
}