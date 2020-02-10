

// eslint-disable-next-line import/no-unresolved
import { Request } from 'express';
import mongodb = require('mongodb');


interface MongoBouncerOptions {
  Request?: Request;
}

declare module 'mongoose' {

  export interface SaveOptions {
    MongoBouncer?: MongoBouncerOptions;
  }

  export interface QueryFindOneAndUpdateOptions {
    MongoBouncer?: MongoBouncerOptions;
  }

  export interface ModelUpdateOptions {
    MongoBouncer?: MongoBouncerOptions;
  }

  export interface ModelRemoveOptions {
    MongoBouncer?: MongoBouncerOptions;
  }

  export interface QueryFindOneAndRemoveOptions {
    MongoBouncer?: MongoBouncerOptions;
  }

  export interface ModelOptions {
    MongoBouncer?: MongoBouncerOptions;
  }
  export interface Model<T extends Document, QueryHelpers = {}> extends NodeJS.EventEmitter, ModelProperties {
    deleteMany(conditions: any, options: ModelOptions, callback?: (err: any) => void): Query<mongodb.DeleteWriteOpResultObject['result'] & { deletedCount?: number }> & QueryHelpers;    
    remove(criteria: any | Query<any>, options: ModelOptions, callback?: (err: any) => void): Query<mongodb.WriteOpResult['result']> & QueryHelpers;
    replaceOne(conditions: any, replacement: any, options: ModelOptions, callback?: (err: any, raw: any) => void): Query<any> & QueryHelpers;
  }
}