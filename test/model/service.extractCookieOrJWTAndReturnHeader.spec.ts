import extractCookieOrJWTAndReturnHeader from '../../src/services/extractCookieOrJWTAndReturnHeader';
import QbConfig from '../../src/classes/class.QbConfig';
import { Request } from 'express';
import { expect } from 'chai';
import OperationOptions from '../../src/classes/class.OperationOptions';

describe('service.extractCookieOrJWTAndReturnHeader', () => {
  const validConfig = new QbConfig({});

  it('will return header with just cookie if present', () => {
    // Prepare 
    const Request = {
      cookies: { 'connect.sid' : '1234.1234' }        
    }  as Request;
    
    const options = new OperationOptions({
      MongoBouncer : { Request }
    });

    // Execute
    const headers = extractCookieOrJWTAndReturnHeader(options, validConfig);

    // Assert
    expect(headers).to.deep.equal({
      cookie: 'connect.sid=1234.1234'
    });

  });

  it('will return header with jwt if just jwt present', () => {
    const Request = {
      headers: {
        authorization: 'Bearer 12345.6789.01234'
      }        
    } as Request;

    const options = new OperationOptions({
      MongoBouncer : { Request }
    });

    // Execute
    const headers = extractCookieOrJWTAndReturnHeader(options, validConfig);

    // Assert
    expect(headers).to.deep.equal({
      authorization: 'Bearer 12345.6789.01234'
    });
  });

  it('will return jwt if both are present', () => {
    const Request = {
      headers: {
        authorization: 'Bearer 12345.6789.01234'
      },
      cookies: { 'connect.sid' : '1234.1234' }        
    } as Request;
    
    const options = new OperationOptions({
      MongoBouncer : { Request }
    });

    // Execute
    const headers = extractCookieOrJWTAndReturnHeader(options, validConfig);

    // Assert
    expect(headers).to.deep.equal({
      authorization: 'Bearer 12345.6789.01234',
    });
  });

  it('will not throw, but leave the headers empty if neither cookie nor jwt present', () => {
    const Request:any = { 
      Request : { headers: {},
        cookies: { }        
      } };
    
    const options = {      
      MongoBouncer : { Request, Disabled: false, }
    };
    // Execute
    const headers = extractCookieOrJWTAndReturnHeader(options, validConfig);

    // Assert
    expect(headers).to.deep.equal({});
    expect(() => extractCookieOrJWTAndReturnHeader(options, validConfig)).not.to.throw;
    
  });
});