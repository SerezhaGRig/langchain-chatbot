import { ToolNode } from "@langchain/langgraph/prebuilt";
import { BaseMessage } from "@langchain/core/messages";
import { memoryStoreRetrieverTool } from "./memoryStoreRetrieverTool";

export const tools = [memoryStoreRetrieverTool];
export const toolNode = new ToolNode<{ messages: BaseMessage[] }>(tools);
