import { MockAdapter } from '../index';
import sinon from 'sinon';
import referee from '@sinonjs/referee';
import MainConfig, { MainConfigInput } from '../src/classes/class.MainConfig';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Mongoose, Model, Schema } from 'mongoose';
import { expect } from 'chai';
import MongoBouncer from '../index';
import { Request } from 'express';

const assert = referee.assert;

async function connect(connectionString:string, mongoose:Mongoose): Promise<void> {
  return new Promise((res, rej) => {
    console.log('Connecting to ' + connectionString);  
    mongoose.connect(connectionString, {
      useNewUrlParser: true,
      autoReconnect: false,
      useFindAndModify: false,
    }, () => {
      res();
    });
  });
}

describe('replace Axios', () => {

  let mongodb: MongoMemoryServer;
  let mymodel: Model<any>;
  let config: MainConfig;

  before(async () => {
    mongodb = new MongoMemoryServer();
    const uri = await mongodb.getUri();
    await connect(uri, mongoose);
    
    const schema = new Schema({
      Value: String,
      Category: String,
    });
    config = new MainConfig({});
    schema.plugin(MongoBouncer, config);
    mymodel = mongoose.model('test', schema );
  });

  beforeEach(async () => {
    mymodel.create([
      { Value: 'Should be returned', Category: 'cat1' },
      { Value: 'Should not be returned', Category: 'cat2' },

    ]);
  });

  afterEach( async () => {
    await mongoose.connection.dropDatabase();
  });

  after(() => {
    mongoose.connection.close();
  });

  // it('will correcly replace the original axios instance', () => {
  //   const config = new MainConfig({});
  //   const spy = sinon.spy(config, 'axios', ['get','set']);    
  //   new MockAdapter(config);    

  //   assert(spy.set.calledOnce);
  // });

  it('the mock adapter will mock axios requests', async () => {
    // Prepare
    const qBouncer = new MockAdapter(config);
    const spy = sinon.spy(config.axios, 'put');
    qBouncer.mock({
      collection: mymodel.collection.collectionName,
      right: 'read',
      response: {
        query: { $or: [{ Category: 'cat1' }] }
      }
    });

    // Execute
    const results = await mymodel.find({},null, {
      MongoBouncer: {
        Request: {} as Request
      }
    });

    // Assert
    expect(results.length).to.equal(1);
    assert(spy.calledOnce);
  });
});