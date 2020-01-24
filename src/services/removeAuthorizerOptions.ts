export default(options: any): void => {
  if(options){
    delete options.MongoBouncer;
  }
};