import { AxiosInstance } from 'axios';
import PluginOptions from './PluginOptions';
import Axios from '@/services/axios';

export default class PluginConfig{
  axios: AxiosInstance;
  baseUrl: string;
  apiVersion: string;
  cookieName: string;

  constructor(options: PluginOptions){    
    this.baseUrl = options.baseUrl || 'http://localhost:8080';
    this.apiVersion = options.apiVersion || 'v1';
    this.cookieName = options.cookieName || 'connect.sid';

    this.axios = options.axios || Axios(this.baseUrl, this.apiVersion);
  }
}