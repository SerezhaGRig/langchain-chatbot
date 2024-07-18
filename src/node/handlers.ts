import { HumanMessage } from "@langchain/core/messages";
import { IState } from "../types";

export const collectZipCodeNodeHandler = (state: IState) => {
  const { messages } = state;
  const lastMessage = messages[messages.length - 1] as HumanMessage;
  const { content } = lastMessage;
  if (typeof content === "string") {
    state.age = content;
  }
  return state;
};

export const collectAgeNodeHandler = (state: IState) => {
  const { messages } = state;
  const lastMessage = messages[messages.length - 1] as HumanMessage;
  const { content } = lastMessage;
  if (typeof content === "string") {
    state.age = content;
  }
  return state;
};
