import "dotenv/config";
import { OpenAIEmbeddings } from "@langchain/openai";
import weaviate from "weaviate-ts-client";
import { WeaviateStore } from "@langchain/weaviate";
import { Document } from "langchain/document";

const { WEAVIATE_SCHEME, WEAVIATE_HOST, WEAVIATE_API_KEY, INDEX_NAME } =
  process.env;

const client = (weaviate as any).client({
  scheme: WEAVIATE_SCHEME || "https",
  host: WEAVIATE_HOST || "localhost",
  apiKey: WEAVIATE_API_KEY
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      new (weaviate as any).ApiKey(WEAVIATE_API_KEY)
    : undefined,
});

const vectorStore = new WeaviateStore(new OpenAIEmbeddings(), {
  client,
  indexName: INDEX_NAME || "Test",
  textKey: "text",
  metadataKeys: ["foo"],
});

export const loadVectorStore = async () => {
  await vectorStore.delete({
    filter: {
      where: {
        operator: "Equal",
        path: ["foo"],
        valueText: "bar",
      },
    },
  });
  await vectorStore.addDocuments([
    new Document({
      pageContent: "Amazon is the longest river",
      metadata: { foo: "bar" },
    }),
    new Document({
      pageContent: "Mount Everest is the highest mount",
      metadata: { foo: "bar" },
    }),
    new Document({
      pageContent: "Mariana Trench is the deepest point in the earth",
      metadata: { foo: "bar" },
    }),
  ]);
};
export const vectorStoreRetriever = vectorStore.asRetriever();
