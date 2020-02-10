import { AxiosInstance } from 'axios';
import PluginOptions from './PluginOptions';
import Axios from '../services/axios';

export default class MainConfig{
  axios: AxiosInstance;
  baseUrl: string;
  apiVersion: string;
  cookieName: string;
  jwtHeaderName: string;

  constructor(options: PluginOptions){    
    this.baseUrl = options.baseUrl || 'http://localhost:8080';
    this.apiVersion = options.apiVersion || 'v1';
    this.cookieName = options.cookieName || 'connect.sid';
    this.jwtHeaderName = options.jwtHeaderName?.toLowerCase() || 'authorization';

    this.axios = options.axios || Axios(this.baseUrl, this.apiVersion);
  }
}