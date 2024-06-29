import { ToolNode } from "@langchain/langgraph/prebuilt";
import { BaseMessage } from "@langchain/core/messages";
import { retrieverTool } from "./retrieverTool";

export const tools = [retrieverTool];
export const toolNode = new ToolNode<{ messages: BaseMessage[] }>(tools);
