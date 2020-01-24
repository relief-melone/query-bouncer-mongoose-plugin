import { Schema } from 'mongoose';
import PluginConfig from '@/classes/PluginConfig';
import saveX from '@/services/pre/shared/pre.saveX';

const preCreate = async (schema: Schema, config: PluginConfig): Promise<void> => {
  saveX( schema, config, 'save' );
};

export default preCreate;