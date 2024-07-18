import { IState } from "../types";
import { AIMessage } from "@langchain/core/messages";
import { END } from "@langchain/langgraph";

export const messageRouteHandler = (state: IState) => {
  const { messages, age, zipCode } = state;
  let interestedInPlansCalled = false;
  const lastMessage = messages[messages.length - 1] as AIMessage;
  // If no tools are called, we can finish (respond to the user)
  // Check if the specific tool is called
  if (
    lastMessage.tool_calls.find((toolCall) => {
      return toolCall.name === "interested-in-plans";
    })
  ) {
    interestedInPlansCalled = true;
  }

  // If the specific tool is called and user name or zip code is not collected
  if (interestedInPlansCalled) {
    if (!age) {
      return "collectAge";
    } else if (!zipCode) {
      return "collectZipCode";
    }
    return "plans";
  }
  if (!lastMessage.tool_calls?.length) {
    return END;
  }
  // console.info("tool call", { tool_calls: lastMessage.tool_calls });
  // Otherwise if there is, we continue and call the tools
  return "tools";
};
