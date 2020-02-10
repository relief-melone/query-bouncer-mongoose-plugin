import { Schema } from 'mongoose';
import removeAuthorizerOptions from '../removeAuthorizerOptions';
import bouncerIsActivated from '../bouncerIsActivated';
import MainConfig from '../../classes/MainConfig';
import extractCookieOrJWTAndReturnHeader from '../extractCookieOrJWTAndReturnHeader';

const preFind = async (
  schema: Schema, 
  config: MainConfig, 
): Promise<void> => {
  (schema as any).pre('remove',{ query: true, document: false } , async function (){       
    if(bouncerIsActivated((this as any).options)){
      const axios = config.axios;
      const collection = (this as any)._collection.collectionName;
      const right = 'delete';
      const query = (this as any).getQuery();
          
      

      try{
        const headers = extractCookieOrJWTAndReturnHeader((this as any).options, config);
        removeAuthorizerOptions(this);
        
        const newQuery = (
          await axios.put(`/${collection}/${right}`, query, { headers })
        ).data.query;

        (this as any).setQuery(newQuery);
      } catch(err) {
        console.log(err);
      }
    } 
  });
};

export default preFind;