import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { IState } from "../types";
import { RunnableConfig } from "@langchain/core/runnables";
import { ToolMessage } from "@langchain/core/messages";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const plansTool = new DynamicStructuredTool({
  name: "interested-in-plans",
  description:
    "Call if user possibly is interested in medical insurance plans or insurance plans",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  schema: z.object({
    age: z.string(),
    zipcode: z.string(),
  }),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  func: async (params: { age: string; zipcode: string }) => {
    // should be api call
    return "plan";
  },
});
export const callPlanTool = async (state: IState, config?: RunnableConfig) => {
  const response = await plansTool.invoke(state, config);
  return {
    ...state,
    messages: [
      new ToolMessage({
        content: response,
        tool_call_id: `${plansTool.name}_${Date.now()}`,
      }),
    ],
  };
};
