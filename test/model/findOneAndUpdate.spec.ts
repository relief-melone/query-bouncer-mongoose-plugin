import { Schema, Mongoose, Model, Document } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import chai, { expect } from 'chai';
import chaiExclude from 'chai-exclude';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import plugin from '../../src/index';

// Imports just for Typings
// eslint-disable-next-line import/no-unresolved
import { Request } from 'express';

chai.use(chaiExclude);
describe('findOneAndUpdate', () => {
  let mongodb: MongoMemoryServer;
  let BlogPost: Model<Document>;  
  let mongoose: Mongoose; 
  let mock: MockAdapter;

  const MongoBouncer = {
    Request : { 
      cookies: { 'connect.sid' :'connect.sid=myCookie' } 
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

  it('will correctly update only the Blogpost with the Category the user has access to', async () => {
    // Prepare
    const originalQuery = { Title : 'Cars are great' };
    const originalPayload = { Title: 'A new BlogPost', Category: 'Cars' };
    mock.onPut('/blogposts/update').reply(200, {
      query: {
        Title: 'Cars are great',
        $or : [{ Category: 'Cars' }]
      },
      payload: originalPayload
    }); 

    // Execute
    const blogPost = await BlogPost.findOneAndUpdate(originalQuery, originalPayload, { MongoBouncer, new: true });

    // Assert
    expect((blogPost as Document).toObject()).excluding(['__v','_id']).to.deep.equal({
      Title: 'A new BlogPost',
      Description: 'True Story',
      Category: 'Cars'
    });
  });

  it('will not modify anything if the user does not have access', async () => {
    const originalQuery = { Title : 'A Cat named Foo' };
    const originalPayload = {
      Title: 'A Cat Named Bar',
      Category: 'Cars'
    };
    
    mock.onPut('/blogposts/update').reply(200, {
      query: {              
        Title: 'A Cat named Foo',
        $or : [{ Category: 'Cars' }]        
      }
    });

    // Execute
    const blogPost = await BlogPost.findOneAndUpdate(originalQuery,originalPayload, { MongoBouncer });

    // Assert
    expect(blogPost).to.equal(null);
  });

  it('will update the document and ignore the permissions if Disabeld is set to true', async () => {
    const MongoBouncer = {
      Request : { 
        cookies: { 'connect.sid' :'connect.sid=myCookie' } 
      } as Request,
      Disabled: true
    };
    const originalQuery = { Title : 'A Cat named Foo' };
    const originalPayload = {
      Title: 'A Cat Named Bar',
      Category: 'Cars'
    };
    
    mock.onPut('/blogposts/update').reply(200, {
      query: {              
        Title: 'A Cat named Foo',
        $or : [{ Category: 'Cars' }]        
      }
    });

    // Execute
    const blogPost = await BlogPost.findOneAndUpdate(originalQuery,originalPayload, { MongoBouncer, new: true });

    // Assert
    expect((blogPost as Document).toObject()).excluding(['__v','_id']).to.deep.equal({ 
      Title: 'A Cat Named Bar', 
      Description: 'A Story about a Cat', 
      Category: 'Cars' 
    });
  });


  afterEach(async () =>  {
    mock.restore();
    await mongoose.connection.dropDatabase();  
  });

  
});