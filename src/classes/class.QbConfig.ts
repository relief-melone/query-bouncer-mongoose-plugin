import { AxiosInstance } from 'axios';
import Axios from '../services/axios';


export interface QbConfigInput {
  baseUrl?: string;
  apiVersion?: string;
  axios?: AxiosInstance;
  cookieName?: string;
  jwtHeaderName?: string;
}


export default class QbConfig{
  // public options: PluginOptions;
  private opts: {
    baseUrl: string;
    apiVersion: string;
    cookieName: string;
    jwtHeaderName: string;
    axios: AxiosInstance;
  };

  constructor(input?: QbConfigInput | QbConfig){
    
    let baseUrl;
    let apiVersion;
    let cookieName;
    let jwtHeaderName;
    let axios;

    if(input instanceof QbConfig){
      baseUrl = input.opts.baseUrl;
      apiVersion = input.opts.apiVersion;
      cookieName = input.opts.cookieName;
      jwtHeaderName = input.opts.jwtHeaderName;
      axios = input.axios;
    } else {
      baseUrl = input 
        ? input.baseUrl || 'http://localhost123:8080'
        : 'http://localhost:8080';
      
      apiVersion = input
        ? input.apiVersion || 'v1'
        : 'v1';
      
      cookieName = input
        ? input.cookieName || 'connect.sid'
        : 'connect.sid';
      
      jwtHeaderName = input 
        ? input.jwtHeaderName?.toLocaleLowerCase() || 'authorization'
        : 'authorization';

      axios = input
        ? input.axios || Axios(baseUrl, apiVersion)
        : Axios(baseUrl, apiVersion);
    }

    this.opts = {
      baseUrl, apiVersion, cookieName, jwtHeaderName, axios
    };
  }  

  set baseUrl(url:string){
    this.opts.baseUrl = url;
  }

  get baseUrl():string{
    return this.opts.baseUrl;
  }

  get apiVersion():string{
    return this.opts.apiVersion;
  }

  get cookieName():string{
    return this.opts.cookieName;
  }

  get jwtHeaderName():string{
    return this.opts.jwtHeaderName;
  }

  get axios():AxiosInstance{
    return this.opts.axios;
  }
  set axios(axios:AxiosInstance){
    this.opts.axios = axios;
    this.baseUrl = axios.defaults.baseURL || this.baseUrl;
  }
}