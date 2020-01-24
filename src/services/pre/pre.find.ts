import { Schema } from 'mongoose';
import PluginConfig from '@/classes/PluginConfig';
import findX from './shared/pre.findX';
const preFind = async (schema: Schema, config: PluginConfig): Promise<void> => {
  findX(schema,config,'find');
};

export default preFind;