import { Schema } from 'mongoose';
import PluginConfig from '@/classes/PluginConfig';
import findX from './shared/pre.findX';
const preFindOne = async (schema: Schema, config: PluginConfig): Promise<void> => {
  findX(schema,config,'findOne');
};

export default preFindOne;