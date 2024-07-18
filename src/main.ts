import { BaseMessage } from "@langchain/core/messages";
import {
  MemorySaver,
  StateGraphArgs,
  START,
  StateGraph,
} from "@langchain/langgraph";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { IState } from "./types";
import { callModel } from "./models";
import { toolNode } from "./tools";
import { question } from "./helper";
import { callPlanTool } from "./tools/interestedInPlansTool";
import { messageRouteHandler } from "./route/handlers";
import {
  collectAgeNodeHandler,
  collectZipCodeNodeHandler,
} from "./node/handlers";

// This defines the agent state
const graphState: StateGraphArgs<IState>["channels"] = {
  messages: {
    value: (x: BaseMessage[], y: BaseMessage[]) => x.concat(y),
    default: () => [],
  },
};

const workflow = new StateGraph<IState>({
  channels: graphState,
})
  .addNode("agent", callModel)
  .addNode("tools", toolNode)
  .addNode("plans", callPlanTool)
  .addNode("collectAge", collectAgeNodeHandler)
  .addNode("collectZipCode", collectZipCodeNodeHandler);

workflow
  .addEdge(START, "agent")
  .addConditionalEdges("agent", messageRouteHandler)
  .addConditionalEdges("collectAge", messageRouteHandler)
  .addConditionalEdges("collectZipCode", messageRouteHandler)
  .addEdge("plans", "agent")
  .addEdge("tools", "agent");

const memory = new MemorySaver();
const app = workflow.compile({ checkpointer: memory });

const sendMessage = async (message: string, threadId: string) => {
  const config = { configurable: { thread_id: threadId } };
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
    await sendMessage(answer, "conversation-num-201");
  }
};
run();
