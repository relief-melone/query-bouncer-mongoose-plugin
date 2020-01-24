import { Schema } from 'mongoose';
import PluginConfig from '@/classes/PluginConfig';
import findX from './shared/pre.findX';
const preDeleteOne = async (schema: Schema, config: PluginConfig): Promise<void> => {
  findX( schema, config, 'deleteOne' );
};

export default preDeleteOne;