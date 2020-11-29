import { Schema } from 'mongoose';
import removeAuthorizerOptions from '../../removeAuthorizerOptions';
import bouncerIsActivated from '../../bouncerIsActivated';
import UpdateSchema from '../../../classes/class.UpdateSchema';
import QbConfig from '../../../classes/class.QbConfig';
import extractCookieOrJWTAndReturnHeader from '../..//extractCookieOrJWTAndReturnHeader';
import OperationOptions, { OperationOptionsInput } from '../../../classes/class.OperationOptions';
import { Query } from 'mongoose';

type PluginModel = Query<any> & UpdateSchema & { options: OperationOptionsInput };

const preUpdateX = async (
  schema: Schema, 
  config: QbConfig, 
  operation: 'update' | 'updateOne'| 'updateMany' | 'findOneAndUpdate'
): Promise<void> => {
  schema.pre(operation, async function (){ 
    const self = this as PluginModel;
    const options = new OperationOptions(self.options);
    if(bouncerIsActivated(options)){
      const axios = config.axios;      
      const collection = self._collection.collectionName;
      const right = 'update';
      const query = self._conditions;
      const payload = self._update;
      delete payload._id;

      try{
        const headers = extractCookieOrJWTAndReturnHeader(options, config);      
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
        if(err.response?.code === 403) throw new Error('preUpdate: User does not have Permission to Update');
        throw err;
      }
    }
  });
};

export default preUpdateX;