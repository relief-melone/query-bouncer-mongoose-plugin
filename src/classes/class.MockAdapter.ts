import MainConfig, { MainConfigInput } from '../classes/class.MainConfig';

import axios from 'axios';
import AxiosMockAdapter  from 'axios-mock-adapter';

interface Response {
  forbidden?: boolean,
  query?: Record<string,any>,
  payload?: Record<string, any>
}

interface MockOpts {
  collection: string,
  right: 'read' | 'create' | 'update' | 'delete',
  response?: Response | Response[]
}


export default class MockAdapter {  
  private mockAdapter: AxiosMockAdapter;
  
  requestsMade: number;
  config: MainConfig;

  constructor(config: MainConfig){    

    this.requestsMade = 0;
    // this.schema;
    // this.queryBouncerPlugin = this.findPlugin(originalOpts);
    const _axios = axios.create({ baseURL: 'http://mock-adapter.local' });
    this.mockAdapter = new AxiosMockAdapter(_axios);
    
    config.axios = _axios;
    config.baseUrl = 'http://mock-adapter.local';
    this.config = config;
  }

  getResponse(opts:MockOpts):Response{
    this.requestsMade++;
    if (Array.isArray(opts.response))
      return opts.response[this.requestsMade];
    
    return opts.response || {};
  }

  mock(opts:MockOpts):void{
    const response = this.getResponse(opts);
    switch (opts.right){
      case 'read':
      case 'update':
      case 'delete':
        
        this.mockAdapter.onPut(`/${opts.collection}/${opts.right}`).reply( config =>
          response.forbidden
            ? [ 403, {}]
            : [ 200, { 
              query: Object.assign(JSON.parse(config.data).query, response.query),
            }]
        );

        break;
      case 'create':
        this.mockAdapter.onPut(`/${opts.collection}/${opts.right}`).reply( _ =>
          response.forbidden
            ? [ 403, {}]
            : [ 200, {}]
            
        );
        break;
    }
  }

  clearMocks():void{
    this.mockAdapter.reset();
  }
}