import { Schema } from 'mongoose';
import PluginConfig from '@/classes/PluginConfig';
import UpdateSchema from '@/classes/UpdateSchema';

import bouncerIsActivated from '@/services/bouncerIsActivated';
import extractCookie from '@/services/extractCookie';
import removeAuthorizerOptions from '@/services/removeAuthorizerOptions';

const preReplaceOne = async (
  schema: Schema, 
  config: PluginConfig, 
): Promise<void> => {
  schema.pre('replaceOne', async function (){ 
    if(bouncerIsActivated((this as any).options)){
      const axios = config.axios;
      const self = this as any as UpdateSchema;
      const collection = self._collection.collectionName;
      const right = 'update';
      const query = self._conditions;
      const payload = self._update;
      delete payload._id;
    
      const cookie = extractCookie((this as any).options, config.cookieName);   
      removeAuthorizerOptions(this);

      try{
        const newQuery = (
          await axios.put(
            `/${collection}/${right}`, 
            { payload, query }, 
            { headers: { cookie } }
          )
        ).data.query;
      
        (this as any).setQuery(newQuery);      
      
      } catch(err) {
        if(err.response.code === 403) throw 'preUpdate: User does not have Permission to Update';
        throw err;
      }
    }
  });
};

export default preReplaceOne;