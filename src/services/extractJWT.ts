import { Request } from 'express';
import { ModelOptions } from 'mongoose';

export default(options: ModelOptions | undefined, headerName: string): string | null => {
  if(
    !options ||
    !options.MongoBouncer ||
    !options.MongoBouncer.Request
  ) throw 'Please provide request in Operation';
  
  const jwt: string | undefined = (options.MongoBouncer.Request as Request).headers?.[headerName] as string | undefined;
  return jwt || null;

};