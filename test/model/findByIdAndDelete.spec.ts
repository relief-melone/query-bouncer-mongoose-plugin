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
describe('findByIdAndDelete', () => {
  let mongodb: MongoMemoryServer;
  let BlogPost: Model<Document>;  
  let mongoose: Mongoose; 
  let mock: MockAdapter;

  const MongoBouncer = {  
    Request : { 
      cookies: { 'connect.sid' :'connect.sid=myCookie' } 
    } as Request
  };
  let ids: string[];

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
    const docs = await BlogPost.insertMany([
      { Title: 'New Food', Description: 'Stuff about super food', Category: 'Food' },
      { Title: 'Cars are great', Description: 'True Story', Category: 'Cars' },
      { Title: 'A Cat named Foo', Description: 'A Story about a Cat', Category: 'Animals' },
      { Title: 'Cars are still great', Description: 'Another true Story', Category: 'Cars' },
    ]);
    ids = docs.map(d => d._id.toString());
  });  

  it('will correctly delete a Document the user has permission to', async () => {
    // Prepare
    const originalQuery = ids[0];   
    mock.onPut('/blogposts/delete').reply(200,{
      query: {
        Title: 'New Food',
        $or : [{ Category: 'Food' }]
      }
    }); 
    
    // Execute
    const blogPost = await BlogPost.findByIdAndDelete(originalQuery,{ MongoBouncer });

    // Assert
    expect((blogPost as Document).toObject()).excluding(['_id', '__v']).to.deep.equal(
      { Title: 'New Food', Description: 'Stuff about super food', Category: 'Food' }  
    );
  });

  it('will not delete a Document the user has no permission to', async () => {
    // Prepare
    const originalQuery = ids[1]; 
    mock.onPut('/blogposts/delete').reply(200, {
      query: {
        Title: 'Cars are great',
        $or : [{ Category: 'Food' }]
      }
    });   
    
    // Execute
    const blogPost = await BlogPost.findByIdAndDelete(originalQuery,{ MongoBouncer });

    // Assert
    expect(blogPost).to.deep.equal(null);
  });

  it('will still delete the Document if MongoBounce is not activated', async () => {
    // Prepare
    const originalQuery = ids[1];
    mock.onPut('/blogposts/delete').reply(200, {
      query: {
        Title: 'Cars are great',
        $or : [{ Category: 'Food' }]
      }
    });    
    
    // Execute
    const blogPost = await BlogPost.findByIdAndDelete(originalQuery);

    // Assert
    expect((blogPost as Document).toObject()).excluding(['_id', '__v']).to.deep.equal(
      { Title: 'Cars are great', Description: 'True Story', Category: 'Cars' },
    );
  });


  afterEach(async () =>  {
    mock.restore();
    await mongoose.connection.dropDatabase();  
  });
});