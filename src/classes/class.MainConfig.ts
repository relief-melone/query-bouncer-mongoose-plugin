import { AxiosInstance } from 'axios';
import Axios from '../services/axios';


export interface MainConfigInput {
  baseUrl?: string;
  apiVersion?: string;
  axios?: AxiosInstance;
  cookieName?: string;
  jwtHeaderName?: string;
}


export default class MainConfig{
  // public options: PluginOptions;
  baseUrl: string;
  apiVersion: string;
  axios: AxiosInstance;
  cookieName: string;
  jwtHeaderName: string;


  constructor(input?: MainConfigInput | MainConfig){
    // this.options = options
    //   ? options instanceof PluginOptions
    //     ? options
    //     : new PluginOptions(options)
    //   : new PluginOptions({});

      this.baseUrl = input 
        ? input.baseUrl || 'http://localhost:8080'
        : 'http://localhost:8080'
      
      this.apiVersion = input
        ? input.apiVersion || 'v1'
        : 'v1';
      
      this.cookieName = input
        ? input.cookieName || 'connect.sid'
        : 'connect.sid'
      
      this.jwtHeaderName = input 
        ? input.jwtHeaderName?.toLocaleLowerCase() || 'authorization'
        : 'authorization';

      this.axios = input
      ? input.axios || Axios(this.baseUrl, this.apiVersion)
      : Axios(this.baseUrl, this.apiVersion)
      
  }  
}