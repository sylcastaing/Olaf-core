FROM hypriot/rpi-node:7

WORKDIR /usr/src/kinect

RUN apt-get update

RUN apt-get install git cmake build-essential libusb-1.0-0-dev python-dev python-pip python-numpy

RUN git clone https://github.com/OpenKinect/libfreenect

WORKDIR /usr/src/kinect/libfreenect

RUN mkdir build

WORKDIR /usr/src/kinect/libfreenect/build

RUN cmake -L ..

RUN make

RUN make install

WORKDIR /usr/src/kinect/libfreenect/wrappers/python

RUN python setup.py install

WORKDIR /usr/src/app

COPY package.json /usr/src/app

ENV NODE_ENV production

ENV MONGODB_URI "mongodb://olaf-data/mean-docker"

RUN npm install

RUN pip install Pillow

COPY . /usr/src/app

EXPOSE 8080

CMD ["npm", "start"]