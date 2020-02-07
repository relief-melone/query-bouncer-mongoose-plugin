import 'module-alias/register';
import extractCookieOrJWTAndReturnHeader from '@/services/extractCookieOrJWTAndReturnHeader';
import MainConfig from '@/classes/MainConfig';
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

  it('will return both in header if cookie and jwt are presend', () => {
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
      cookie: 'connect.sid=1234.1234'
    });
  });

  it('will throw if neither cookie nor jwt presend', () => {
    const options = {
      MongoBouncer : { Request : {
        headers: {

        },
        cookies: { }        
      } as Request }
    };

    // Assert
    expect(() => extractCookieOrJWTAndReturnHeader(options, validConfig)).to.throw;
    
  });
});