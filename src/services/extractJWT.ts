import { Request } from 'express';
import OperationOptions from '../classes/class.OperationOptions';

export default(options: OperationOptions | undefined, headerName: string): string | null => {
  if(
    !options ||
    !options.MongoBouncer ||
    !options.MongoBouncer.Request
  ) throw 'Please provide request in Operation';
  
  const jwt: string | undefined = (options.MongoBouncer.Request as Request).headers?.[headerName] as string | undefined;
  return jwt || null;

};