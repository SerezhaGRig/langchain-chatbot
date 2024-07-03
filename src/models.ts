import { ChatOpenAI } from "@langchain/openai";
import { RunnableConfig } from "@langchain/core/runnables";
import { IState } from "./types";
import { tools } from "./tools";

const models = new ChatOpenAI({ model: "gpt-4o" });
const boundModel = models.bindTools(tools);

export const callModel = async (state: IState, config?: RunnableConfig) => {
  const { messages } = state;
  const response = await boundModel.invoke(messages, config);
  return { messages: [response] };
};
