import { Schema } from 'mongoose';
import QbConfig from '../../classes/class.QbConfig';
import findX from './shared/pre.findX';
const preFind = async (schema: Schema, config: QbConfig): Promise<void> => {
  findX(schema,config,'find');
};

export default preFind;