import { dataType } from "weaviate-client";

export type VectorStoreSchemaKeys = keyof typeof dataType;
export type VectorStoreSchemaValues = (typeof dataType)[VectorStoreSchemaKeys];
