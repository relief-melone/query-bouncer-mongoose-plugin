import { Schema } from 'mongoose';
import PluginConfig from '@/classes/PluginConfig';

import preUpdateX from './shared/pre.updateX';

const preFindOneAndUpdate = async (schema: Schema, config: PluginConfig): Promise<void> => {
  preUpdateX(schema, config, 'findOneAndUpdate');
};

export default preFindOneAndUpdate;