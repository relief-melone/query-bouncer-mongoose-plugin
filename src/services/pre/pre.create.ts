import { Schema } from 'mongoose';
import QbConfig from '../../classes/class.QbConfig';
import saveX from '../../services/pre/shared/pre.saveX';

const preCreate = async (schema: Schema, config: QbConfig): Promise<void> => {
  saveX( schema, config, 'save' );
};

export default preCreate;