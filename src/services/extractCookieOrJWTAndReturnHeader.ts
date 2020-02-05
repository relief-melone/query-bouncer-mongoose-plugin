import PluginConfig from '@/classes/PluginConfig';
import { ModelOptions } from 'mongoose';
import extractJWT from './extractJWT';
import extractCookie from './extractCookie';

type Headers = {jwt?: string; cookie?: string};

export default(options: ModelOptions, config: PluginConfig): Headers => {
  const jwt = extractJWT(options, config.jwtHeaderName);
  const cookieValue = extractCookie(options, config.cookieName);   
  if(!jwt && !cookieValue) throw 'Neither cookie nor JWT present in request';
  const headers: Headers = {} ;
  if(jwt) headers[config.jwtHeaderName] = jwt;
  if(cookieValue) headers.cookie = `${config.cookieName}=${cookieValue}`;

  return headers;
};