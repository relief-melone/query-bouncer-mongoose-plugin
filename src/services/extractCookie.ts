// eslint-disable-next-line import/no-unresolved
import { Request } from 'express';

export default(options: any, cookieName = 'connect.sid'): string => {
  if(!options) throw 'Please provide request in Operation';
  if(!options.MongoBouncer) throw 'Please provide request in Operation';
  if(!options.MongoBouncer.Request) throw 'Please provide request in Operation';
  
  const cookie: string = (options.MongoBouncer.Request as Request).cookies[cookieName];
  if(!cookie) throw 'Cookie not found';    
  return cookie;  
};