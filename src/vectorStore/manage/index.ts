import weaviate, { WeaviateClient, WeaviateField } from "weaviate-client";

import type { EmbeddingsInterface } from "@langchain/core/embeddings";
import { VectorStoreSchemaValues } from "./types";

export class VectorStore {
  client: WeaviateClient;
  embeddings: EmbeddingsInterface;
  constructor(client: WeaviateClient, embeddings: EmbeddingsInterface) {
    this.client = client;
    this.embeddings = embeddings;
  }
  createCollection = async (
    collectionName: string,
    schema: { [key: string]: VectorStoreSchemaValues },
  ) => {
    await this.client.collections.create({
      name: collectionName,
      properties: Object.getOwnPropertyNames(schema).map((key) => {
        return {
          name: key,
          dataType: schema[key],
        };
      }),
    });
  };
  insertIntoCollection = async (
    collectionName: string,
    object: { [key: string]: string | number },
  ) => {
    const collection = this.client.collections.get(collectionName);
    return collection.data.insert(object);
  };
  insertManyIntoCollection = async (
    collectionName: string,
    object: { [key: string]: string | number }[],
  ) => {
    const collection = this.client.collections.get(collectionName);
    return collection.data.insertMany(object);
  };
  updateFromCollectionById = async (
    collectionName: string,
    id: string,
    object: Record<string, WeaviateField>,
  ) => {
    const collection = this.client.collections.get(collectionName);
    return collection.data.update({
      id,
      properties: object,
    });
  };
  deleteFromCollectionById = async (collectionName: string, id: string) => {
    const collection = this.client.collections.get(collectionName);
    return collection.data.deleteById(id);
  };
  deleteFromCollectionByFilter = async (
    collectionName: string,
    property: string,
    valueToCompare: string,
  ) => {
    const collection = this.client.collections.get(collectionName);
    return collection.data.deleteMany(
      collection.filter.byProperty(property).equal(valueToCompare),
    );
  };
  nearTextInCollection = async (collectionName: string, nearText: string) => {
    const collection = this.client.collections.get(collectionName);
    return collection.query.nearText(nearText);
  };
  readAllFromCollection = async (
    collectionName: string,
    skip: string,
    take: string,
  ) => {
    const collection = this.client.collections.get(collectionName);
    return collection.query.fetchObjects({
      limit: Number.parseInt(take, 10),
      offset: Number.parseInt(skip, 10),
    });
  };
  static getClient = async (url: string, key: string) => {
    return await weaviate.connectToWeaviateCloud(url, {
      authCredentials: new weaviate.ApiKey(key),
    });
  };
}
