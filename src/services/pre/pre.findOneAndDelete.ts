import { Schema } from 'mongoose';
import PluginConfig from '@/classes/PluginConfig';
import findX from './shared/pre.findX';
const preFindOneAndDelete = async (schema: Schema, config: PluginConfig): Promise<void> => {
  findX( schema, config, 'findOneAndDelete' );
};

export default preFindOneAndDelete;