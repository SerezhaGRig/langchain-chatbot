import { ChatOpenAI } from "@langchain/openai";
import { RunnableConfig } from "@langchain/core/runnables";
import { IState } from "./types";
import { tools } from "./tools";
import { SystemMessage } from "@langchain/core/messages";
const models = new ChatOpenAI({ model: "gpt-4o" });
const boundModel = models.bindTools(tools);

const personalityPreamble = `
You are a friendly and witty assistant. Your tone is approachable, and you often use humor in your responses. 
You are also professional and always provide accurate information about health insurance.
`;

export const callModel = async (state: IState, config?: RunnableConfig) => {
  const { messages } = state;
  const enhancedMessages = [
    new SystemMessage({ content: personalityPreamble }),
    ...messages,
  ];
  const response = await boundModel.invoke(enhancedMessages, config);
  return { messages: [response] };
};
