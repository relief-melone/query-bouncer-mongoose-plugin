import { Schema } from 'mongoose';
import bouncerIsActivated from '../../bouncerIsActivated';
import removeAuthorizerOptions from '../../removeAuthorizerOptions';
import QbConfig from '../../../classes/class.QbConfig';
import extractCookieOrJWTAndReturnHeader from '../../extractCookieOrJWTAndReturnHeader';
import { Query, Document } from 'mongoose';
import { Model } from 'mongoose';
import OperationOptions, { OperationOptionsInput } from '../../../classes/class.OperationOptions';

type PluginModel = Document & { options: OperationOptionsInput };


const preSaveX = async (schema: Schema, config: QbConfig, operation: 'save'): Promise<void> => {
  schema.pre(operation, async function (){ 
    const self = this as PluginModel;
    const options = new OperationOptions(self.$__.saveOptions);
    if(bouncerIsActivated(options)){
      const axios = config.axios;      
      const collection = self.collection.collectionName;
      const right = 'create';
      const payload = self.toObject();
      delete payload._id;
      delete payload.__v;
      try{        
        const headers = extractCookieOrJWTAndReturnHeader(options, config);
        removeAuthorizerOptions(self);

        (await axios.put(
          `/${collection}/${right}`, 
          { payload }, 
          { headers }
        ));        
      } catch(err) {
        if(err.response?.status === 403 || err.response?.code === 403) throw new Error('pre.SaveX: User does not have Permission to Create');
        throw err;
      }
    }
  });
};

export default preSaveX;