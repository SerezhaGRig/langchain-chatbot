import { ToolNode } from "@langchain/langgraph/prebuilt";
import { BaseMessage } from "@langchain/core/messages";
import { retrieverTools } from "./vectorStoreRetrieverTool";
import { plansTool } from "./interestedInPlansTool";

export const tools = [...retrieverTools, plansTool];
export const toolNode = new ToolNode<{ messages: BaseMessage[] }>(tools);
