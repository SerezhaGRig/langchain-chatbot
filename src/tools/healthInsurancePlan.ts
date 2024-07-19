import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { getSearchHealthPlans } from "../documents/fetch/healthPlans";

const { MARKETPLACE_API_KEY } = process.env;

export const healthInsurancePlans = new DynamicStructuredTool({
  name: "health-insurance-plan",
  description:
    "Call if user possibly is interested in medical insurance plans or insurance plans " +
    "or user question is out of medical insurance context or health care info",
  schema: z.object({
    zipCode: z.string().describe("zipcode of customer"),
    countyFips: z.string().describe("countyfips of customer"),
    state: z
      .string()
      .describe("state of customer should be short form 2 characters"),
    householdIncome: z
      .number()
      .describe("household income of customer should be number"),
    household: z
      .array(
        z.object({
          age: z.number().describe("age of customer should be number"),
          tobaccoUse: z
            .boolean()
            .describe(
              "tobacco use status of customer response should be true or false",
            ),
        }),
      )
      .describe("household people members info age and tobacco use status"),
  }),
  func: async (params) => {
    const searchHealthPlans = getSearchHealthPlans(MARKETPLACE_API_KEY);
    return await searchHealthPlans(params);
  },
});
