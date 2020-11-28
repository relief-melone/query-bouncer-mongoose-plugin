import { Schema } from 'mongoose';
import MainConfig from '../../classes/class.MainConfig';
import findX from './shared/pre.findX';
const preFindOneAndDelete = async (schema: Schema, config: MainConfig): Promise<void> => {
  findX( schema, config, 'findOneAndRemove' );
};

export default preFindOneAndDelete;