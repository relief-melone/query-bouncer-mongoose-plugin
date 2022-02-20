import { Schema, Mongoose, } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import chai, { expect } from 'chai';
import chaiExclude from 'chai-exclude';
import axios from 'axios';
import plugin from '../../src/index';
import MockAdapter from 'axios-mock-adapter';

// Imports just for Types
// eslint-disable-next-line import/no-unresolved
import { Request } from 'express';


chai.use(chaiExclude);
describe('deleteOne', () => {
  let mongodb: MongoMemoryServer;
  let BlogPost: any;  
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
    await mongoose.connect(await mongodb.getUri()); 

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
    const blogPost = await BlogPost.deleteOne(originalQuery,{ MongoBouncer });

    // Assert
    expect(blogPost).to.deep.equal(
      { deletedCount: 1, }   
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
    const blogPost = await BlogPost.deleteOne(originalQuery,{ MongoBouncer });

    // Assert
    expect(blogPost).to.deep.equal({ deletedCount: 0 } );
  });

  it('will still delete the Document if MongoBounce is not activated', async () => {
    // Prepare
    const originalQuery = { Title: 'Cars are great' };   
    mock.onPut('/blogposts/delete').reply(200, {
      query: {
        Title: 'Cars are great',
        $or : [{ Category: 'Food' }]
      }
    }); 
    
    // Execute
    const blogPost = await BlogPost.deleteOne(originalQuery);

    // Assert
    expect(blogPost).to.deep.equal({ deletedCount: 1 } );
  });


  afterEach(async () =>  {
    mock.restore();
    await mongoose.connection.dropDatabase();  
  });
});