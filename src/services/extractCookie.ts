// eslint-disable-next-line import/no-unresolved
import { Request } from 'express';

export default(queryOptions: any, cookieName: string): string | null => {
  if(!queryOptions) throw 'Please provide request in Operation';
  if(!queryOptions.MongoBouncer) throw 'Please provide request in Operation';
  if(!queryOptions.MongoBouncer.Request) throw 'Please provide request in Operation';
  
  const cookie: string | undefined = (queryOptions.MongoBouncer.Request as Request).cookies?.[cookieName];      
  return cookie || null;  
};