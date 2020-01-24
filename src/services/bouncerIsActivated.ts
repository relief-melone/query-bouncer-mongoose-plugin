export default (options: any): boolean => {
  if(!options) return false;
  if(!options.MongoBouncer) return false;
  return true;
};