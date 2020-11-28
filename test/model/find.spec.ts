import { Schema, Mongoose, Model, Document } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import chai, { expect } from 'chai';
import chaiExclude from 'chai-exclude';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import plugin from '../../src/index';

// Imports Just for Types
// eslint-disable-next-line import/no-unresolved
import { Request } from 'express';

chai.use(chaiExclude);
describe('find', () => {
  let mongodb: MongoMemoryServer;
  let BlogPost: Model<Document>;  
  let mongoose: Mongoose; 
  let mock: MockAdapter;

  const MongoBouncer = {
    Request : { 
      cookies: { 'connect.sid' :'myCookie' } 
    } as Request
  };

  before(async () => {    
    mongoose = new Mongoose();
    mongodb = new MongoMemoryServer();  
    mongoose.plugin(plugin,{ axios });
    await mongoose.connect(await mongodb.getUri(), {
      useNewUrlParser: true,
      useUnifiedTopology: true
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
    ]);
  });  

  it('will correctly return only the BlogPosts for Category Cars as stated by the users permissions', async () => {
    // Prepare
    mock.onPut('/blogposts/read').reply(200, {
      query: {
        $or : [{ Category: 'Cars' }]
      }
    });
    
    // Execute
    const blogPosts = await BlogPost.find({}, null, { MongoBouncer });

    // Assert
    expect(blogPosts.map(a => a.toObject())).excluding(['__v', '_id']).to.deep.equal([
      { Title: 'Cars are great', Description: 'True Story', Category: 'Cars' },
      { Title: 'Cars are still great', Description: 'Another true Story', Category: 'Cars' }
    ]);
  });

  it('will return the correct entry if Query is more specific',async () => {
    // Prepare
    mock.onPut('/blogposts/read').reply(200, {
      query: {
        Title: 'Cars are still great',
        $or : [{ Category: 'Cars' }]
      }
    });
    
    // Execute
    const blogPosts = await BlogPost.find({ Title: 'Cars are still great' }, null, { MongoBouncer });

    // Assert
    expect(blogPosts.map(a => a.toObject())).excluding(['__v', '_id']).to.deep.equal([
      { Title: 'Cars are still great', Description: 'Another true Story', Category: 'Cars' }      
    ]);
  });

  it('will return an empty array if no document matches the permissions', async () => {
    // Prepare
    mock.onPut('/blogposts/read').reply(200, {
      query: {
        Category: 'Food',
        $or : [{ Category: 'Cars' }]
      }
    });
    
    // Execute
    const blogPosts = await BlogPost.find({ Category: 'Food' }, null, { MongoBouncer });

    // Assert
    expect(blogPosts.map(a => a.toObject())).excluding(['__v', '_id']).to.deep.equal([]);
  });

  it('bouncer will not interfere if MongoBouncer missing in options. All Docs will be returned', async () => {
    // Prepare
    mock.onPut('/blogposts/read').reply(500, 'This should never be called');
    
    // Execute
    const blogPosts = await BlogPost.find({});

    // Assert
    expect(blogPosts.length).to.equal(4);
  });

  it('bouncer will not run and the requested documents will be returned if disabled is set to true', async () => {
    // Prepare
    const MongoBouncer = {
      Request : { 
        cookies: { 'connect.sid' :'myCookie' } 
      } as Request,
      Disabled: true
    };

    mock.onPut('/blogposts/read').reply(200, {
      query: {
        Category: 'Food',
        $or : [{ Category: 'Cars' }]
      }
    });
    
    // Execute
    const blogPosts = await BlogPost.find({ Category: 'Food' }, null, { MongoBouncer });

    // Assert
    expect(blogPosts.map(a => a.toObject())).excluding(['__v', '_id']).to.deep.equal([
      { Title: 'New Food', Description: 'Stuff about super food', Category: 'Food' }
    ]);
  });

  afterEach(async () =>  {
    mock.restore();
    await mongoose.connection.dropDatabase();  
  });

  
  
});