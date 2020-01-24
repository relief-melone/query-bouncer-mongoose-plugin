import { AxiosInstance } from 'axios';

export default interface PluginOptions {
  baseUrl?: string;
  apiVersion?: string;
  axios?: AxiosInstance;
  cookieName?: string;
}