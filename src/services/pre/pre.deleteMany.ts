import { Schema } from 'mongoose';
import MainConfig from '@/classes/MainConfig';
import findX from './shared/pre.findX';
const preDeleteMany = async (schema: Schema, config: MainConfig): Promise<void> => {
  findX( schema, config, 'deleteMany' );
};

export default preDeleteMany;