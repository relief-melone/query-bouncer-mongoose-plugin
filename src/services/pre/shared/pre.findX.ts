import { Schema } from 'mongoose';
import removeAuthorizerOptions from '../../removeAuthorizerOptions';
import bouncerIsActivated from '../../bouncerIsActivated';
import QbConfig from '../../../classes/class.QbConfig';
import extractCookieOrJWTAndReturnHeader from '../../extractCookieOrJWTAndReturnHeader';
import { Query, Model } from 'mongoose';
import OperationOptions, { OperationOptionsInput } from '../../../classes/class.OperationOptions';

type PluginModel = Query<any, any> & { options: OperationOptionsInput };

const preFind = async (
  schema: Schema, 
  config: QbConfig, 
  operation: 'find' | 'findOne' | 'findOneAndDelete' | 'findOneAndRemove' | 'deleteOne' | 'deleteMany' | 'remove'
): Promise<void> => {
  schema.pre(operation, async function (){
    const self = this as PluginModel;
    const options = new OperationOptions(self.options);
    if(bouncerIsActivated(options)){
      const axios = config.axios;
      const collection = self._collection.collectionName;
      const right = ['find','findOne'].some(o => o === operation) ? 'read' : 'delete';
      const query = self.getFilter();
     

      try{
        const headers = extractCookieOrJWTAndReturnHeader(options, config);      
        removeAuthorizerOptions(self);

        const newQuery = (
          await axios.put(`/${collection}/${right}`, { query }, { headers })
        ).data.query;

        self.setQuery(newQuery);
      } catch(err:any) {        
        throw err;
      }
    } 
  });
};

export default preFind;