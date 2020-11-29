import { Schema } from 'mongoose';
import QbConfig from '../../classes/class.QbConfig';
import findX from './shared/pre.findX';
const preFindOneAndDelete = async (schema: Schema, config: QbConfig): Promise<void> => {
  findX( schema, config, 'findOneAndRemove' );
};

export default preFindOneAndDelete;