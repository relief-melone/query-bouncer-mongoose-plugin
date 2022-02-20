import mongoose from '../database/service.mongodbConnector';
import BlogPost from '../classes/interface.blogPost';
import { getSchemaPlain, getSchemaWithPlugin } from '../schemas/schema.blogPost';

const schemaPlain = getSchemaPlain();
const schemaWithPlugin = getSchemaWithPlugin();

export const modelPlain = mongoose.model<BlogPost>('blog_posts_plain', schemaPlain);
export const modelWithPlugin = mongoose.model<BlogPost>('blog_posts_with_plugin', schemaWithPlugin);
