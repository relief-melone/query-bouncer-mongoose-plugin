import MainConfig from '../classes/class.MainConfig';
import extractJWT from './extractJWT';
import extractCookie from './extractCookie';
import OperationOptions from '../classes/class.OperationOptions';

type Headers = {jwt?: string; cookie?: string};

export default(options: OperationOptions, config: MainConfig): Headers => {
  const jwt = extractJWT(options, config.jwtHeaderName);
  const cookieValue = extractCookie(options, config.cookieName); 
  
  const headers:Headers = {};
  if(jwt || cookieValue){
    if(jwt) headers[config.jwtHeaderName] = jwt;
    else if(cookieValue) headers.cookie = `${config.cookieName}=${cookieValue}`;
  }  

  return headers;
};