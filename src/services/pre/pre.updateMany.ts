import { Schema } from 'mongoose';
import PluginConfig from '@/classes/PluginConfig';
import preUpdateX from './shared/pre.updateX';

const preUpdateMany = async (schema: Schema, config: PluginConfig): Promise<void> => {
  preUpdateX(schema, config, 'updateMany');
};

export default preUpdateMany;