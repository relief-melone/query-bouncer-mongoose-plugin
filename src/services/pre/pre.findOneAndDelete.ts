import { Schema } from 'mongoose';
import MainConfig from '@/classes/MainConfig';
import findX from './shared/pre.findX';
const preFindOneAndDelete = async (schema: Schema, config: MainConfig): Promise<void> => {
  findX( schema, config, 'findOneAndDelete' );
};

export default preFindOneAndDelete;