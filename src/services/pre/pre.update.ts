import { Schema } from 'mongoose';
import MainConfig from '../../classes/MainConfig';
import preUpdateX from './shared/pre.updateX';

const preUpdate = async (schema: Schema, config: MainConfig): Promise<void> => {
  preUpdateX(schema, config, 'update');
};

export default preUpdate;