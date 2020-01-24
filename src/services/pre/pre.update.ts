import { Schema } from 'mongoose';
import PluginConfig from '@/classes/PluginConfig';
import preUpdateX from './shared/pre.updateX';

const preUpdate = async (schema: Schema, config: PluginConfig): Promise<void> => {
  preUpdateX(schema, config, 'update');
};

export default preUpdate;