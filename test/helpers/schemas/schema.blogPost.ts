import { Schema } from 'mongoose';
import BlogPost from '../classes/interface.blogPost';

import qbPlugin from '../../../';
import QbConfig from '../../../src/classes/class.QbConfig';
import defaultConfig from '../config/qbConfig';

export const getSchemaPlain = () => new Schema<BlogPost>({
  Category: { type: String, required: true },
  Description: { type: String, required: true },
  Title: { type: String, required: true }
});

export const getSchemaWithPlugin = (config:QbConfig = defaultConfig) => getSchemaPlain()
  .plugin(qbPlugin,config);