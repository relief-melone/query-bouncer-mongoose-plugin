import { Schema } from 'mongoose';
import removeAuthorizerOptions from '@/services/removeAuthorizerOptions';
import bouncerIsActivated from '@/services/bouncerIsActivated';
import UpdateSchema from '@/classes/UpdateSchema';
import PluginConfig from '@/classes/PluginConfig';
import extractCookieOrJWTAndReturnHeader from '@/services/extractCookieOrJWTAndReturnHeader';

const preUpdateX = async (
  schema: Schema, 
  config: PluginConfig, 
  operation: 'update' | 'updateOne'| 'updateMany' | 'findOneAndUpdate'
): Promise<void> => {
  schema.pre(operation, async function (){ 
    if(bouncerIsActivated((this as any).options)){
      const axios = config.axios;
      const self = this as any as UpdateSchema;
      const collection = self._collection.collectionName;
      const right = 'update';
      const query = self._conditions;
      const payload = self._update;
      delete payload._id;

      try{
        const headers = extractCookieOrJWTAndReturnHeader((this as any).options, config);      
        removeAuthorizerOptions(this);

        const newQuery = (
          await axios.put(
            `/${collection}/${right}`, 
            { payload, query }, 
            { headers }
          )
        ).data.query;
      
        this.setQuery(newQuery);      
      
      } catch(err) {
        if(err.response.code === 403) throw 'preUpdate: User does not have Permission to Update';
        throw err;
      }
    }
  });
};

export default preUpdateX;