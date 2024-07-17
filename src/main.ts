import { BaseMessage } from "@langchain/core/messages";
import {
  MemorySaver,
  StateGraphArgs,
  END,
  START,
  StateGraph,
} from "@langchain/langgraph";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { IState } from "./types";
import { callModel } from "./models";
import { toolNode } from "./tools";
import { question } from "./helper";
import { callPlanTool } from "./tools/interestedInPlansTool";

// This defines the agent state
const graphState: StateGraphArgs<IState>["channels"] = {
  messages: {
    value: (x: BaseMessage[], y: BaseMessage[]) => x.concat(y),
    default: () => [],
  },
};

const routeMessage = (state: IState) => {
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

const workflow = new StateGraph<IState>({
  channels: graphState,
})
  .addNode("agent", callModel)
  .addNode("tools", toolNode)
  .addNode("plans", callPlanTool)
  .addNode("collectName", (state) => {
    const { messages } = state;
    const lastMessage = messages[messages.length - 1] as HumanMessage;
    const { content } = lastMessage;
    if (typeof content === "string") {
      state.age = content;
    }
    return state;
  })
  .addNode("collectZipCode", (state) => {
    const { messages } = state;
    const lastMessage = messages[messages.length - 1] as HumanMessage;
    const { content } = lastMessage;
    if (typeof content === "string") {
      state.age = content;
    }
    return state;
  });

workflow
  .addEdge(START, "agent")
  .addConditionalEdges("agent", routeMessage)
  .addConditionalEdges("collectName", routeMessage)
  .addConditionalEdges("collectZipCode", routeMessage)
  .addEdge("plans", "agent")
  .addEdge("tools", "agent");

const memory = new MemorySaver();
const app = workflow.compile({ checkpointer: memory });

const sendMessage = async (message: string) => {
  const config = { configurable: { thread_id: "conversation-num-200" } };
  const inputs = { messages: [new HumanMessage({ content: message })] };
  for await (const { messages } of await app.stream(inputs, {
    ...config,
    streamMode: "values",
  })) {
    const msg = messages[messages?.length - 1];
    if (msg?.content) {
      if (msg instanceof AIMessage) {
        console.log("AI Assistant:", msg.content);
        console.log("-----\n");
      }
      // } else if (msg instanceof HumanMessage) {
      //   console.log("User:", msg.content);
      //   console.log("-----\n");
      // }
    }
  }
};

const run = async () => {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const answer = await question("User: ");
    await sendMessage(answer);
  }
};
run();
