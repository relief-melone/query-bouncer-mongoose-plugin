import { Schema } from 'mongoose';
import QbConfig from '../../classes/class.QbConfig';
import preUpdateX from './shared/pre.updateX';

const preUpdateOne = async (schema: Schema, config: QbConfig): Promise<void> => {
  preUpdateX(schema, config, 'updateOne');
};

export default preUpdateOne;