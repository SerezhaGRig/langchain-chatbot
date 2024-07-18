import { ToolNode } from "@langchain/langgraph/prebuilt";
import { BaseMessage } from "@langchain/core/messages";
import { retrieverTools } from "./vectorStoreRetrieverTool";
import { healthInsurancePlans } from "./healthInsurancePlan";

export const tools = [...retrieverTools, healthInsurancePlans];
export const toolNode = new ToolNode<{ messages: BaseMessage[] }>(tools);
