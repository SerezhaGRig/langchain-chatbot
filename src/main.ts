import { BaseMessage } from "@langchain/core/messages";
import {MemorySaver, StateGraphArgs, END, START, StateGraph} from "@langchain/langgraph"
import { AIMessage, HumanMessage } from "@langchain/core/messages"
import {IState} from "./types";
import {callModel} from "./models";
import {toolNode} from "./tools";






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
    // Otherwise if there is, we continue and call the tools
    return "tools";
};


const workflow = new StateGraph<IState>({
    channels: graphState,
})
    .addNode("agent", callModel)
    .addNode("tools", toolNode)

workflow
    .addEdge(START, "agent")
    .addConditionalEdges("agent", routeMessage)
    .addEdge("tools", "agent");

const memory = new MemorySaver();
const app = workflow.compile({ checkpointer: memory });

const sendMessage = async (message)=>{
    const config = { configurable: { thread_id: "conversation-num-100" } };
    const inputs = { messages: [new HumanMessage({content: message})] };
    for await (
        const { messages } of await app.stream(inputs, {
        ...config,
        streamMode: "values",
    })
        ) {
        let msg = messages[messages?.length - 1];
        //console.log(messages)
        if (msg?.content) {
            if(msg instanceof AIMessage){
                console.log('AI Assistant:', msg.content);
                console.log("-----\n");
            }
            else if(msg instanceof HumanMessage){
                console.log('User:', msg.content);
                console.log("-----\n");
            }
        }

    }
}

const run = async ()=>{
    await sendMessage("What is weather in New York?")
    await sendMessage("Is cold in New York now?")
}
run()




