import { Schema } from 'mongoose';
import PluginConfig from '@/classes/PluginConfig';
import preUpdateX from './shared/pre.updateX';

const preUpdateOne = async (schema: Schema, config: PluginConfig): Promise<void> => {
  preUpdateX(schema, config, 'updateOne');
};

export default preUpdateOne;