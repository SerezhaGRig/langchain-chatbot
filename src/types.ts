import { BaseMessage } from "@langchain/core/messages";

export interface IState {
  messages: BaseMessage[];
  age?: string;
  zipCode?: string;
}
