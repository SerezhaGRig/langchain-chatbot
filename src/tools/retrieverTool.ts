import { createRetrieverTool } from "langchain/tools/retriever";
import { retriever } from "../vectorStore";

export const retrieverTool = createRetrieverTool(retriever, {
  name: "retrieve-geographic-info",
  description:
    "Search and return information about the geographic info about objects on the earth and give interesting story",
});
