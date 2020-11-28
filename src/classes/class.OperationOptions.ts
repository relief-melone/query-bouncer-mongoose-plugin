import { Request as ERequest } from 'express';

export interface OperationOptionsInput{
  MongoBouncer?: {
    Disabled?: boolean;
    Request?: ERequest  
  }  
}

export default class OperationOptions{
  MongoBouncer: {
    Disabled: boolean;
    Request?: ERequest;
  };
  

  constructor(input:OperationOptionsInput){
    this.MongoBouncer = {
      Disabled: input.MongoBouncer?.Disabled === true
        ? true
        : false,
    };

    if(!input.MongoBouncer) this.MongoBouncer.Disabled = true;    
    if(input.MongoBouncer?.Request) this.MongoBouncer.Request = input.MongoBouncer.Request;
  }
}