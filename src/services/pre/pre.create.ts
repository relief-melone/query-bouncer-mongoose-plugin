import { Schema } from 'mongoose';
import MainConfig from '../../classes/class.MainConfig';
import saveX from '../../services/pre/shared/pre.saveX';

const preCreate = async (schema: Schema, config: MainConfig): Promise<void> => {
  saveX( schema, config, 'save' );
};

export default preCreate;