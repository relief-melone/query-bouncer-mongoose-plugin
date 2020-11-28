import { AxiosInstance } from 'axios';
import PluginOptions, { PluginOptionsInput } from './class.PluginOptions';
import Axios from '../services/axios';

export default class MainConfig{
  public options: PluginOptions;

  constructor(options?: PluginOptionsInput | PluginOptions){
    this.options = options
      ? options instanceof PluginOptions
        ? options
        : new PluginOptions(options)
      : new PluginOptions({});
  }

  get baseUrl():string{
    return this.options.baseUrl;
  }
  get apiVersion():string{
    return this.options.apiVersion;
  }
  get cookieName():string{
    return this.options.cookieName;
  }
  get jwtHeaderName():string{
    return this.options.jwtHeaderName;
  }

  get axios():AxiosInstance{
    return this.options.axios || Axios(this.baseUrl, this.apiVersion);
  }
  set axios(axios:AxiosInstance){
    this.options.axios = axios;
  }
  
}