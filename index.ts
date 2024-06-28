import { ToolNode } from "@langchain/langgraph/prebuilt"

import { TavilySearchResults } from "@langchain/community/tools/tavily_search"
import { ChatGroq } from "@langchain/groq";
import { AIMessage, BaseMessage } from "@langchain/core/messages";


import { SqliteSaver } from "@langchain/langgraph/checkpoint/sqlite"

import { START, END, MessageGraph } from "@langchain/langgraph"
import * as util from "util";

const GROQ_API_KEY = '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'
const TAVILY_API_KEY='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'

// Define the function that determines whether to continue or not
function shouldContinue(messages: BaseMessage[]): "action" | typeof END {
    const lastMessage = messages[messages.length - 1];

    // If there is no function call, then we finish
    if (!(lastMessage as AIMessage)?.tool_calls) {
        return END;

    } else {
        return "action";

    }
}

// Define a new graph

const tools = [new TavilySearchResults({ maxResults: 1, apiKey: TAVILY_API_KEY })];

const model = new ChatGroq({ model: "llama3-8b-8192", apiKey: GROQ_API_KEY,}).bindTools(tools);

const workflow = new MessageGraph()
    .addNode("my-node", (state)=>{
        console.log(util.inspect(state))
        return state
    })
    .addNode("agent", model)
    .addNode("action", new ToolNode<BaseMessage[]>(tools));


workflow.addEdge(START, "my-node");
workflow.addEdge("my-node", "agent")
// Conditional agent -> action OR agent -> END
workflow.addConditionalEdges("agent", shouldContinue);
// Always transition `action` -> `agent`
workflow.addEdge("action", "agent");


const memory = SqliteSaver.fromConnString(":memory:"); // Here we only save in-memory

// Setting the interrupt means that any time an action is called, the machine will stop
const app = workflow.compile({ checkpointer: memory, interruptBefore: ["action"] });
// Run the graph
const thread = { configurable: { thread_id: "4" } };
const main = async ()=>{
    const result = await app.invoke("what is the weather in sf currently" , { ...thread })
    console.info('result', util.inspect(result, { depth: 8}))
}
main().then(()=>{
    console.log('success')
})
