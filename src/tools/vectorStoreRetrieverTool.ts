import { createRetrieverTool } from "langchain/tools/retriever";
import { vectorStoreRetriever } from "../vectorStore";

export const vectorStoreRetrieverTool = createRetrieverTool(
  vectorStoreRetriever,
  {
    name: "medical-insurance-care-cms-agent-provider-plans-instructions-aca",
    description:
      "The Centers for Medicare & Medicaid Services (CMS) " +
      "ACA Law act Notice of Benefit and Payment Parameters for 2025 Final Rule" +
      " ACA Law act " +
      "Medicaid & Dental benefits " +
      "From coverage to Care" +
      " What you should know about providers " +
      "Patient Protection and Affordable Care Act, HHS Notice of Benefit and Payment Parameters for 2024" +
      "regs to implement equal employemnt provision",
  },
);
