import { ToolNode } from "@langchain/langgraph/prebuilt";
import { BaseMessage } from "@langchain/core/messages";
import { vectorStoreRetrieverTool } from "./vectorStoreRetrieverTool";

export const tools = [vectorStoreRetrieverTool];
export const toolNode = new ToolNode<{ messages: BaseMessage[] }>(tools);
