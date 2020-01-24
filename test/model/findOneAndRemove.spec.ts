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
describe('findOneAndRemove', () => {
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
    ]);
  });  

  it('will correctly delete a Document the user has permission to', async () => {
    // Prepare
    const originalQuery = { Title: 'New Food' }; 
    mock.onPut('/blogposts/delete').reply(200, {
      query: {
        Title: 'New Food',
        $or : [{ Category: 'Food' }]
      }
    });
    
    // Execute
    const blogPost = await BlogPost.findOneAndRemove(originalQuery,{ MongoBouncer });

    // Assert
    expect((blogPost as Document).toObject()).excluding(['__v', '_id']).to.deep.equal(
      { Title: 'New Food', Description: 'Stuff about super food', Category: 'Food' }    
    );
  });

  it('will not delete a Document the user has no permission to', async () => {
    // Prepare
    const originalQuery = { Title: 'Cars are great' };    
    mock.onPut('/blogposts/delete').reply(200, {
      query: {
        Title: 'Cars are great',
        $or : [{ Category: 'Food' }]
      }
    });
    
    // Execute
    const blogPost = await BlogPost.findOneAndRemove(originalQuery,{ MongoBouncer });

    // Assert
    expect(blogPost).to.equal(null);
  });


  afterEach(async () =>  {
    mock.restore();
    await mongoose.connection.dropDatabase();  
  });
});