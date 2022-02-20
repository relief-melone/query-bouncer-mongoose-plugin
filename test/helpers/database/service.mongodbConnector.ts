import M = require('mongoose');
import { Mongoose as _Mongoose } from 'mongoose';

const Mongoose = new M.Mongoose();
Mongoose.pluralize(null);

// Connect to MongoDB
export async function connect(connectionString:string, mongoose:_Mongoose): Promise<void> {
  return new Promise((res) => {
    console.log('Connecting to ' + connectionString);  
    mongoose.connect(connectionString, {
    }, () => {
      res();
    });
  });
}

export default Mongoose;

export const connectToDb = async (connectionString, mongoose = Mongoose):Promise<void> => {
  const prom = connect(connectionString, mongoose);

  mongoose.connection.on('open', () => {    
    console.log('\x1b[32m', 'Successfully connected to database', '\u001b[0m');
  });

  mongoose.connection.on('error', () => {
    console.log('Connection to database lost. Good Bye...');
    setTimeout(() => {
      process.exit();
    }, 500);
  });

  mongoose.connection.on('disconnect', () => {
    console.log('Database got disconnected. Good Bye...');
    setTimeout(() => {
      process.exit();
    }, 500);
  });

  mongoose.connection.on('close', () => {
    console.log('Connection to database was closed. Good Bye..');
    setTimeout(() => {
      process.exit();
    }, 500);
  });

  await prom;
};