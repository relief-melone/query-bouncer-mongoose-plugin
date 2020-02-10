import { Schema } from 'mongoose';
import MainConfig from '../../classes/MainConfig';
import findX from './shared/pre.findX';
const preDeleteOne = async (schema: Schema, config: MainConfig): Promise<void> => {
  findX( schema, config, 'deleteOne' );
};

export default preDeleteOne;