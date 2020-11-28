import { Schema } from 'mongoose';
import MainConfig from '../../classes/class.MainConfig';
import findX from './shared/pre.findX';
const preDeleteOne = async (schema: Schema, config: MainConfig): Promise<void> => {
  findX( schema, config, 'deleteOne' );
};

export default preDeleteOne;