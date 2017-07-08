#!/usr/bin/env python

import freenect
import time
import os
import sys

from PIL import Image

if not os.path.exists('./camera/tmp'):
    os.makedirs('./camera/tmp', 0777)

while 1:
    rgb = freenect.sync_get_video()[0]

    filename = 'camera-' + str(time.time()).replace('.', '') + '.jpeg'

    img = Image.fromarray(rgb, 'RGB')
    img.save('./camera/tmp/' + filename)

    print filename
    sys.stdout.flush()

    time.sleep(0.2)