import { BaseMessage } from "@langchain/core/messages";
import { StateGraphArgs, END, START, StateGraph } from "@langchain/langgraph";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { IState } from "./types";
import { callModel } from "./models";
import { toolNode } from "./tools";
import { question } from "./helper";
import { PostgresSaver } from "./checkpointer/postgres";
import { getPostgresConfig } from "./checkpointer/config";

// This defines the agent state
const graphState: StateGraphArgs<IState>["channels"] = {
  messages: {
    value: (x: BaseMessage[], y: BaseMessage[]) => x.concat(y),
    default: () => [],
  },
};

const routeMessage = (state: IState) => {
  const { messages } = state;
  const lastMessage = messages[messages.length - 1] as AIMessage;
  // If no tools are called, we can finish (respond to the user)
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
  .addNode("tools", toolNode);

workflow
  .addEdge(START, "agent")
  .addConditionalEdges("agent", routeMessage)
  .addEdge("tools", "agent");

const sendMessage = async (app: any, message: string) => {
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
  const checkpointer = await PostgresSaver.fromConnString(getPostgresConfig());
  const app = workflow.compile({ checkpointer });
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const answer = await question("User: ");
    await sendMessage(app, answer);
  }
};
run();
