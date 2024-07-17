import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const plansTool = new DynamicStructuredTool({
  name: "interested-in-plans",
  description:
    "Call if user possibly is interested in medical insurance plans or insurance plans",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  schema: z.object({
    age: z.string().describe("age of user"),
    zipcode: z.string().describe("zipcode of user"),
  }),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  func: async (params: { age: string; zipcode: string }) => {
    // should be api call
    return "plan";
  },
});
