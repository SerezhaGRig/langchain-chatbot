import { OpenAIEmbeddings } from "@langchain/openai";
import weaviate from "weaviate-ts-client";
import { WeaviateStore } from "@langchain/weaviate";

import { ScoreThresholdRetriever } from "langchain/retrievers/score_threshold";

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
  indexName: INDEX_NAME || "test",
});

export const vectorStoreRetriever = ScoreThresholdRetriever.fromVectorStore(
  vectorStore,
  {
    minSimilarityScore: 0.9, // Finds results with at least this similarity score
    maxK: 100, // The maximum K value to use. Use it based to your chunk size to make sure you don't run out of tokens
    kIncrement: 2, // How much to increase K by each time. It'll fetch N results, then N + kIncrement, then N + kIncrement * 2, etc.
  },
);
