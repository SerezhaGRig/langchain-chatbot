import { OpenAIEmbeddings } from "@langchain/openai";

import { Document } from "langchain/document";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { ScoreThresholdRetriever } from "langchain/retrievers/score_threshold";

const memoryVectorStore = new MemoryVectorStore(new OpenAIEmbeddings());
export const loadMemoryVectorStore = async () => {
  await memoryVectorStore.addDocuments([
    new Document({
      pageContent: "Amazon is the longest river",
    }),
    new Document({
      pageContent: "Mount Everest is the highest mount",
    }),
    new Document({
      pageContent: "Mariana Trench is the deepest point in the earth",
    }),
  ]);
};

export const memoryStoreRetriever = ScoreThresholdRetriever.fromVectorStore(
  memoryVectorStore,
  {
    minSimilarityScore: 0.9, // Finds results with at least this similarity score
    maxK: 100, // The maximum K value to use. Use it based to your chunk size to make sure you don't run out of tokens
    kIncrement: 2, // How much to increase K by each time. It'll fetch N results, then N + kIncrement, then N + kIncrement * 2, etc.
  },
);
