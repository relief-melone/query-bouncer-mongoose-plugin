import './types/mongoose';

import { Schema } from 'mongoose';
import MainConfig, {MainConfigInput} from './classes/class.MainConfig';

import preFind from './services/pre/pre.find';
import preFindOne from './services/pre/pre.findOne';
import preFindOneAndDelete from './services/pre/pre.findOneAndDelete';
import preFindOneAndRemove from './services/pre/pre.findOneAndRemove';
import preUpdate from './services/pre/pre.update';

import preFindOneAndUpdate from './services/pre/pre.findOneAndUpdate';
import preDeleteOne from './services/pre/pre.deleteOne';
import preDeleteMany from './services/pre/pre.deleteMany';
import preRemove from './services/pre/pre.remove';
import preUpdateOne from './services/pre/pre.updateOne';
import preUpdateMany from './services/pre/pre.updateMany';
import preCreate from './services/pre/pre.create';
import preReplaceOne from './services/pre/pre.replaceOne';

import OperationOptions, { OperationOptionsInput } from './classes/class.OperationOptions';
import MockAdapter from './classes/class.MockAdapter';

export {
  OperationOptions,
  OperationOptionsInput,
  MockAdapter
};


export default async (schema: Schema, options: MainConfigInput): Promise<void> => {  
  const pluginConfig = new MainConfig(options);
  
  preCreate(schema, pluginConfig);
  preDeleteMany(schema, pluginConfig);
  preDeleteOne(schema, pluginConfig);  
  preFind(schema, pluginConfig);
  preFindOne(schema, pluginConfig);
  preFindOneAndDelete(schema, pluginConfig);
  preFindOneAndRemove(schema, pluginConfig);
  preFindOneAndUpdate(schema,  pluginConfig);
  preRemove(schema,pluginConfig);
  preReplaceOne(schema, pluginConfig);
  preUpdate(schema, pluginConfig);
  preUpdateMany(schema, pluginConfig);
  preUpdateOne(schema, pluginConfig);

};