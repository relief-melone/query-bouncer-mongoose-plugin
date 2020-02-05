import { Schema } from 'mongoose';
import bouncerIsActivated from '@/services/bouncerIsActivated';
import removeAuthorizerOptions from '@/services/removeAuthorizerOptions';
import PluginConfig from '@/classes/PluginConfig';
import { Document } from 'mongoose';
import extractCookieOrJWTAndReturnHeader from '@/services/extractCookieOrJWTAndReturnHeader';

const preSaveX = async (schema: Schema, config: PluginConfig, operation: 'save'): Promise<void> => {
  schema.pre(operation, async function (){ 
    const options = (this as any).$__.saveOptions;
    if(bouncerIsActivated(options)){
      const axios = config.axios;
      const self = this as any as Document;
      const collection = self.collection.collectionName;
      const right = 'create';
      const payload = self.toObject();
      delete payload._id;
      delete payload.__v;
      try{        
        const headers = extractCookieOrJWTAndReturnHeader(options, config);
        removeAuthorizerOptions(this);

        (await axios.put(
          `/${collection}/${right}`, 
          { payload }, 
          { headers }
        ));        
      } catch(err) {
        if(err.response.status === 403 || err.response.code === 403) throw 'pre.SaveX: User does not have Permission to Create';
        throw err;
      }
    }
  });
};

export default preSaveX;