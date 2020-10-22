import extractCookieOrJWTAndReturnHeader from '../../src/services/extractCookieOrJWTAndReturnHeader';
import MainConfig from '../../src/classes/MainConfig';
import { Request } from 'express';
import { expect } from 'chai';

describe('service.extractCookieOrJWTAndReturnHeader', () => {
  const validConfig = new MainConfig({});

  it('will return header with just cookie if present', () => {
    // Prepare 
    const options = {
      MongoBouncer : { Request : {
        cookies: { 'connect.sid' : '1234.1234' }        
      } as Request }
    };

    // Execute
    const headers = extractCookieOrJWTAndReturnHeader(options, validConfig);

    // Assert
    expect(headers).to.deep.equal({
      cookie: 'connect.sid=1234.1234'
    });

  });

  it('will return header with jwt if just jwt present', () => {
    const options = {
      MongoBouncer : { Request : {
        headers: {
          authorization: 'Bearer 12345.6789.01234'
        }        
      } as Request }
    };

    // Execute
    const headers = extractCookieOrJWTAndReturnHeader(options, validConfig);

    // Assert
    expect(headers).to.deep.equal({
      authorization: 'Bearer 12345.6789.01234'
    });
  });

  it('will return jwt if both are present', () => {
    const options = {
      MongoBouncer : { Request : {
        headers: {
          authorization: 'Bearer 12345.6789.01234'
        },
        cookies: { 'connect.sid' : '1234.1234' }        
      } as Request }
    };

    // Execute
    const headers = extractCookieOrJWTAndReturnHeader(options, validConfig);

    // Assert
    expect(headers).to.deep.equal({
      authorization: 'Bearer 12345.6789.01234',
    });
  });

  it('will not throw, but leave the headers empty if neither cookie nor jwt present', () => {
    const options = {
      MongoBouncer : { Request : {
        headers: {

        },
        cookies: { }        
      } as Request }
    };
    // Execute
    const headers = extractCookieOrJWTAndReturnHeader(options, validConfig);

    // Assert
    expect(headers).to.deep.equal({});
    expect(() => extractCookieOrJWTAndReturnHeader(options, validConfig)).not.to.throw;
    
  });
});