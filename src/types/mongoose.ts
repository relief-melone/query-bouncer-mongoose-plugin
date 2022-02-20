

// eslint-disable-next-line import/no-unresolved
import { Request } from 'express';
import mongodb = require('mongodb');
import { Collection } from 'mongoose';


interface MongoBouncerOptions {
  Request?: Request;
  Disabled?: boolean;
}

declare module 'mongoose' {

  export interface SaveOptions {
    MongoBouncer?: MongoBouncerOptions;
  }

  export interface QueryFindOneAndUpdateOptions {
    MongoBouncer?: MongoBouncerOptions;
  }

  export interface QueryFindBaseOptions {
    MongoBouncer?: MongoBouncerOptions
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

  export interface QueryFindOptions {
    MongoBouncer?: MongoBouncerOptions
  }

  export interface QueryOptions {
    MongoBouncer?: MongoBouncerOptions
  }

  export interface ModelOptions {
    MongoBouncer?: MongoBouncerOptions;
  }

  /* eslint-disable @typescript-eslint/ban-types */
  export interface Query<ResultType, DocType, THelpers = {}, RawDocType = DocType>{
    _collection: Collection
  }

  export interface InternalCache{
    saveOptions: ModelOptions,
    _id: mongodb.ObjectId,

  }
  export interface Document {
    $__: InternalCache
  }

  // Model['remove'];
  // /* eslint-disable @typescript-eslint/ban-types */
  // export interface Model<T extends Document<any, any, any>, TQueryHelpers = {}, TMethodsAndOverrides = {}, TVirtuals = {}, QueryHelpers = {}, TMethodOverrides = {}> extends NodeJS.EventEmitter {
  //   deleteMany(conditions: FilterQuery<any>, options: QueryOptions, callback?: (err: any) => void): any;    
  //   remove(filter: FilterQuery<Document>, options: ModelOptions, callback?: CallbackWithoutResult): void;
  //   replaceOne(conditions: any, replacement: any, options: ModelOptions, callback?: (err: any, raw: any) => void): Query<any> & QueryHelpers;
  // }
}