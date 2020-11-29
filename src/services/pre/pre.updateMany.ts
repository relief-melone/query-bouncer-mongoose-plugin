import { Schema } from 'mongoose';
import QbConfig from '../../classes/class.QbConfig';
import preUpdateX from './shared/pre.updateX';

const preUpdateMany = async (schema: Schema, config: QbConfig): Promise<void> => {
  preUpdateX(schema, config, 'updateMany');
};

export default preUpdateMany;