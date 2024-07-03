import { createRetrieverTool } from "langchain/tools/retriever";
import { vectorStoreRetriever } from "../vectorStore";

export const vectorStoreRetrieverTool = createRetrieverTool(
  vectorStoreRetriever,
  {
    name: "retrieve-geographic-info",
    description:
      "Search and return information about the geographic info about objects on the earth and give interesting story",
  },
);
