import { Schema } from 'mongoose';
import MainConfig from '@/classes/MainConfig';

import preUpdateX from './shared/pre.updateX';

const preFindOneAndUpdate = async (schema: Schema, config: MainConfig): Promise<void> => {
  preUpdateX(schema, config, 'findOneAndUpdate');
};

export default preFindOneAndUpdate;