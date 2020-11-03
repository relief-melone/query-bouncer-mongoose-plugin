import { AxiosInstance } from 'axios';
import PluginOptions from './PluginOptions';
import Axios from '../services/axios';

export default class MainConfig{
  public options: PluginOptions;

  constructor(options?: PluginOptions){
    this.options = options || {};
  }

  get baseUrl():string{
    return this.options.baseUrl || 'http://localhost:8080';
  }
  get apiVersion():string{
    return this.options.apiVersion || 'v1';
  }
  get cookieName():string{
    return this.options.cookieName || 'connect.sid';
  }
  get jwtHeaderName():string{
    return this.options.jwtHeaderName?.toLowerCase() || 'authorization';
  }

  get something():string{
    return 'This';
  }

  get axios():AxiosInstance{
    return this.options.axios || Axios(this.baseUrl, this.apiVersion);
  }
  set axios(axios:AxiosInstance){
    this.options.axios = axios;
  }
  
}