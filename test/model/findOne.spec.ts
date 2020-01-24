import { Schema, Mongoose, Model, Document } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import chai, { expect } from 'chai';
import chaiExclude from 'chai-exclude';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import plugin from '../../src/index';

chai.use(chaiExclude);
describe('findOne', () => {
  let mongodb: MongoMemoryServer;
  let BlogPost: Model<Document>;  
  let mongoose: Mongoose; 
  let mock: MockAdapter;

  const MongoBouncer = {
    Request : { 
      cookies: { 'connect.sid' :'connect.sid=myCookie' } 
    } 
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
    const blogPost = await BlogPost.findOne({}, null,{ MongoBouncer });

    // Assert
    expect((blogPost as Document).toObject()).excluding(['__v', '_id']).to.deep.equal(
      { Title: 'Cars are great', Description: 'True Story', Category: 'Cars' }    
    );
  });

  it('will return if there is just a document the user has no access to', async () => {
    // Prepare
    mock.onPut('/blogposts/read').reply(200, {
      query: {
        $or : [{ Category: 'Cars' }]
      }
    });
    
    // Execute
    const blogPost = await BlogPost.findOne({}, null, { MongoBouncer });

    // Assert
    expect((blogPost as Document).toObject()).excluding(['__v', '_id']).to.deep.equal(
      { Title: 'Cars are great', Description: 'True Story', Category: 'Cars' }    
    );
  });

  afterEach(async () =>  {
    mock.restore();
    await mongoose.connection.dropDatabase();  
  });
});