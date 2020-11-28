import { Schema } from 'mongoose';
import MainConfig from '../../classes/class.MainConfig';
import findX from './shared/pre.findX';
const preFindOne = async (schema: Schema, config: MainConfig): Promise<void> => {
  findX(schema,config,'findOne');
};

export default preFindOne;