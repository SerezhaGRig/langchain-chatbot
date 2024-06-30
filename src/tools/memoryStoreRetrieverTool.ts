import { createRetrieverTool } from "langchain/tools/retriever";
import { memoryStoreRetriever } from "../vectorStore/memoryVectorStore";

export const memoryStoreRetrieverTool = createRetrieverTool(
  memoryStoreRetriever,
  {
    name: "retrieve-geographic-info",
    description:
      "Search and return information about the geographic info about objects on the earth and give interesting story",
  },
);
