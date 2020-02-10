import { Schema } from 'mongoose';
import MainConfig from '../../classes/MainConfig';
import UpdateSchema from '../../classes/UpdateSchema';

import bouncerIsActivated from '../bouncerIsActivated';
import removeAuthorizerOptions from '../removeAuthorizerOptions';
import extractCookieOrJWTAndReturnHeader from '../extractCookieOrJWTAndReturnHeader';

const preReplaceOne = async (
  schema: Schema, 
  config: MainConfig, 
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
      
        (this as any).setQuery(newQuery);      
      
      } catch(err) {
        if(err.response.code === 403) throw 'preUpdate: User does not have Permission to Update';
        throw err;
      }
    }
  });
};

export default preReplaceOne;