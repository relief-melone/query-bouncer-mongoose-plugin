import Axios from '../services/axios';
import { AxiosInstance } from 'axios';


export interface PluginOptionsInput {
  baseUrl?: string;
  apiVersion?: string;
  axios?: AxiosInstance;
  cookieName?: string;
  jwtHeaderName?: string;
}

export default class PluginOptions {
  
  baseUrl: string;
  apiVersion: string;
  cookieName: string;
  jwtHeaderName: string;
  axios?: AxiosInstance;

  constructor(input:PluginOptionsInput){  

    this.baseUrl = input.baseUrl || 'http://localhost:8080';
    this.apiVersion = input.apiVersion || 'v1';
    this.cookieName = input.cookieName || 'connect.sid';
    this.jwtHeaderName = input.jwtHeaderName?.toLocaleLowerCase() || 'authorization';
    this.axios = input.axios || Axios(this.baseUrl, this.apiVersion);
    
    if(input.cookieName) this.cookieName = input.cookieName;
    if(input.jwtHeaderName) this.jwtHeaderName = input.jwtHeaderName;
    
  }
}