'use strict';

import CameraEvents from './camera.events';
import BufferStream from 'bufferstream';
import fs from 'fs';

var spawn = require('child_process').spawn;
var py = spawn('python', ['./camera/camera.py']);

var uint8arrayToString = function (data) {
  return String.fromCharCode.apply(null, data);
};

function init() {
  py.stdout.on('data', (data) => {

    let fileName = uint8arrayToString(data).trim();

    fs.createReadStream(__dirname + '/tmp/' + fileName)
    .on('data', (chunk) => {
       CameraEvents.emit('camera', {
          image: true,
          buffer: chunk.toString('base64')
        });
    })
    .on('end', () => {  // done
      fs.unlinkSync(__dirname + '/tmp/' + fileName);
    })
    .on('error', (error) => {
      console.log('Camera error %s', error);
    });
  });

  py.on('exit', (code) => {
    console.log('Process quit with code : ' + code);
  });

  py.stderr.on('data', (data) => {
    console.log(uint8arrayToString(data));
  });
}

export default init;