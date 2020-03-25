import { Schema, Mongoose, Model, Document } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import chai, { expect } from 'chai';
import chaiExclude from 'chai-exclude';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import plugin from '../../src/index';

// Imports just for Types
// eslint-disable-next-line import/no-unresolved
import { Request } from 'express';

chai.use(chaiExclude);

describe('create', () => {
  let mongodb: MongoMemoryServer;
  let BlogPost: Model<Document>;  
  let mongoose: Mongoose;
  let mock: MockAdapter;
  
  const MongoBouncer = { 
    Request : { 
      cookies: { 'connect.sid' :'connect.sid=myCookie' },
      headers: { 'authorization': 'Bearer 1235615.123125152.23312' }
    } as Request
  };
  

  before(async () => {      
    mongoose = new Mongoose();
    mongodb = new MongoMemoryServer();  
    mongoose.plugin(plugin,{ axios });
    
    await mongoose.connect(await mongodb.getUri(), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    }); 

    const BlogPostSchema = new Schema({
      Title: { type: String, required: true } ,
      Description: { type: String },
      Category: { type: String, required: true }
    });
    BlogPost = mongoose.model('blogpost', BlogPostSchema);
  });

  beforeEach(async () => {      
    mock = new MockAdapter(axios); 
    await BlogPost.insertMany([
      { Title: 'New Food', Description: 'Stuff about super food', Category: 'Food' },
      { Title: 'Cars are great', Description: 'True Story', Category: 'Cars' },
      { Title: 'A Cat named Foo', Description: 'A Story about a Cat', Category: 'Animals' },
      { Title: 'Cars are still great', Description: 'Another true Story', Category: 'Cars' },
      { Title: 'Cars are great', Description: 'Another true Story', Category: 'Misc' },
    ]);
  });  

  it('will correctly create a Blogpost', async () => {
    // Prepare

    const originalPayload = [{ Title: 'A new BlogPost', Category: 'Cars', Description: 'Stuff' }]; 
    mock.onPut('/blogposts/create').reply(200, {
      payload: originalPayload
    });
    
    // Execute
    const blogPosts = (await BlogPost.create(originalPayload, { MongoBouncer })) as any as Document[];


    // Assert
    expect(blogPosts.length).to.equal(1);
    expect(blogPosts.map(d => d.toObject())).excludingEvery(['_id', '__v']).to.deep.equal(originalPayload);
    expect(blogPosts[0]._id).to.exist;
  });

  it('will throw an error if the payload does not match the permissions', async () => {    
    const originalPayload = [{ Title: 'A new BlogPost', Category: 'Cars', Description: 'Stuff' }]; 
    
    mock.onPut('/blogposts/create').reply(403, { } );
    
    // Execute
    try {
      await BlogPost.create(originalPayload,{ MongoBouncer });
      console.log(this);
    } catch(err) {
      expect(err.message).equal('pre.SaveX: User does not have Permission to Create');
    }
  });

  it('will throw the no cookie or jwt header present error if neither is present', async () => {
    const originalPayload = [{ Title: 'A new BlogPost', Category: 'Cars', Description: 'Stuff' }]; 
    const MongoBouncer = {
      Request: {}
    };
    mock.onPut('/blogposts/create').reply(200, {
      payload: originalPayload
    });
    
    // Execute/Assert
    try {
      await BlogPost.create(originalPayload,{ MongoBouncer });
      console.log(this);
    } catch(err) {
      expect(err.message).to.equal('Neither cookie nor JWT present in request');
    }
  });

  afterEach(async () =>  {
    mock.restore();
    await mongoose.connection.dropDatabase();  
  });

  
});