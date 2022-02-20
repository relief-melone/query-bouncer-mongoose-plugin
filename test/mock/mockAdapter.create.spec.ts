import { MongoMemoryServer } from 'mongodb-memory-server';
import Sinon, { SinonFakeTimers } from 'sinon';
import mongoose, { connect } from '../helpers/database/service.mongodbConnector';
import { MockAdapter } from '../../src';
import qbConfig from '../helpers/config/qbConfig';
import { modelWithPlugin } from '../helpers/model/model.blogPost';
import { Request } from 'express';
import { expect } from 'chai';
import assert from 'assert';

describe('call.MockAdapter', () => {
  let mongodb: MongoMemoryServer;
  let qBouncer: MockAdapter;
  let clock: SinonFakeTimers;

  before(async () => {
    mongodb = await MongoMemoryServer.create({
      instance: { port: 38123 }
    });
    const uri = await mongodb.getUri();
    await connect(uri, mongoose);
  });

  beforeEach(() => {
    qBouncer = new MockAdapter(qbConfig);
  });

  afterEach(async () => {
    await mongoose.connection.dropDatabase();
    qBouncer.clearMocks();
  });

  after(() => {
    mongoose.connection.close();
    mongodb.stop();
  });

  it('will correctly allow creation of model', async () => {
    // Prepare

    const req = { 
      MongoBouncer: { Disabled: false }
    } as any as Request;

    qBouncer.mock({
      collection: modelWithPlugin.collection.collectionName,
      right: 'create',
      response: {
        forbidden: false
      }
    });

    // Execute
    await modelWithPlugin.create([{
      Title: 'this should work',
      Description: 'a blog post i am allowed to create',
      Category: 'my-category'
    }], {
      MongoBouncer: { Disabled: false, Request: req }
    });

    // await modelWithPlugin.find({}, undefined, {
    //   MongoBouncer: { Disabled: false, Request: req}
    // });

    // Assert
  });

  it('will correcly forbid if mongobouncer says so', async () => {
    // Prepare

    const req = { 
      MongoBouncer: { Disabled: false }
    } as any as Request;

    qBouncer.mock({
      collection: modelWithPlugin.collection.collectionName,
      right: 'create',
      response: {
        forbidden: true
      }
    });

    // Execute
    try {
      await modelWithPlugin.create([{
        Title: 'this should work',
        Description: 'a blog post i am allowed to create',
        Category: 'my-category'
      }], {
        MongoBouncer: { Disabled: false, Request: req }
      });

      // Assert
      assert.fail('should have thrown');
    } catch (err:any) {
      expect(err.message).to.equal('pre.SaveX: User does not have Permission to Create');
    }
  });
});