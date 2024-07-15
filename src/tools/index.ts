import { ToolNode } from "@langchain/langgraph/prebuilt";
import { BaseMessage } from "@langchain/core/messages";
import { retrieverTools } from "./vectorStoreRetrieverTool";

export const tools = retrieverTools;
export const toolNode = new ToolNode<{ messages: BaseMessage[] }>(tools);
