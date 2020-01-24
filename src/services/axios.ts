import Axios, { AxiosInstance } from 'axios';

export default (baseUrl = process.env.AUTHORIZER_BASE_URL, apiVersion = process.env.AUTHORIZER_API_VERSION): AxiosInstance => {
  return Axios.create({
    baseURL: `${baseUrl}/api/${apiVersion}`,
  });
};