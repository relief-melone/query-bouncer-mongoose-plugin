import { Schema } from 'mongoose';
import extractCookie from '@/services/extractCookie';
import removeAuthorizerOptions from '@/services/removeAuthorizerOptions';
import bouncerIsActivated from '@/services/bouncerIsActivated';
import PluginConfig from '@/classes/PluginConfig';


const preFind = async (
  schema: Schema, 
  config: PluginConfig, 
  operation: 'find' | 'findOne' | 'findOneAndDelete' | 'findOneAndRemove' | 'deleteOne' | 'deleteMany' | 'remove'
): Promise<void> => {
  schema.pre(operation, async function (){       
    if(bouncerIsActivated((this as any).options)){
      const axios = config.axios;
      const collection = (this as any)._collection.collectionName;
      const right = ['find','findOne'].some(o => o === operation) ? 'read' : 'delete';
      const query = (this as any).getQuery();
    
      const cookie = extractCookie((this as any).options);   
      removeAuthorizerOptions(this);

      try{
        const newQuery = (
          await axios.put(`/${collection}/${right}`, query, { headers: { cookie } })
        ).data.query;

        (this as any).setQuery(newQuery);
      } catch(err) {        
        throw err;
      }
    } 
  });
};

export default preFind;