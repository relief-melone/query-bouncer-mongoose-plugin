export default interface UpdateSchema {
  _update: Record<string,any>;
  _conditions: Record<string,any>;
  _collection: {
    collectionName: string;
  };
}