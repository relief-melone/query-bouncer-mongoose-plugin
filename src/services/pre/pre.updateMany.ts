import { Schema } from 'mongoose';
import MainConfig from '../../classes/class.MainConfig';
import preUpdateX from './shared/pre.updateX';

const preUpdateMany = async (schema: Schema, config: MainConfig): Promise<void> => {
  preUpdateX(schema, config, 'updateMany');
};

export default preUpdateMany;