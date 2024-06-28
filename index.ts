import { ToolNode } from "@langchain/langgraph/prebuilt"

import { TavilySearchResults } from "@langchain/community/tools/tavily_search"
import { ChatOpenAI } from "@langchain/openai";
import { AIMessage, BaseMessage } from "@langchain/core/messages";


import { SqliteSaver } from "@langchain/langgraph/checkpoint/sqlite"

import { START, END, MessageGraph } from "@langchain/langgraph"
import * as util from "util";

const TAVILY_API_KEY='xxxx'
const OPENAI_API_KEY = 'xxxx'

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

const model = new ChatOpenAI({ model: "gpt-4o", apiKey: OPENAI_API_KEY,})

const workflow = new MessageGraph()
    .addNode("agent", model)
    .addNode("action", new ToolNode<BaseMessage[]>(tools));


workflow.addEdge(START, "agent");
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
    result.forEach(r=>{
        if(r?.content){
            console.info('ai', r.content)
        }
    })

}
main().then(()=>{
    console.log('success')
})
