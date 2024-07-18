import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

export const healthInsurancePlans = new DynamicStructuredTool({
  name: "health-insurance-plan",
  description:
    "Call if user possibly is interested in medical insurance plans or insurance plans " +
    "or user question is out of medical insurance context or health care info",
  schema: z.object({
    age: z.string().describe("age of customer"),
    zipCode: z.string().describe("zipcode of customer"),
  }),
  func: async ({ zipCode, age }) => {
    // api call
    return `plans for zipcode: ${zipCode} and for age: ${age}`;
  },
});
