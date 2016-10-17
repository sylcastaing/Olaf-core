import app from './';
import mongoose from 'mongoose';

after((done) => {
  app.olafCore.on('close', () => done());
  mongoose.connection.close();
  app.olafCore.close();
});