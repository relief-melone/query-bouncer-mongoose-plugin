import OperationOptions from '../classes/class.OperationOptions';

export default (options: OperationOptions): boolean => {
  if(!options) return false;
  if(!options.MongoBouncer) return false;
  if(options.MongoBouncer.Disabled) return false;
  return true;
};