import { createRetrieverTool } from "langchain/tools/retriever";
import { vectorStoreRetriever } from "../vectorStore";

export const vectorStoreRetrieverTool = createRetrieverTool(
  vectorStoreRetriever,
  {
    name: "notice-of-benefit-and-payment-parameters",
    description:
      "The Centers for Medicare & Medicaid Services (CMS) finalized standards for issuers and Marketplaces, as well as requirements for agents, brokers, web-brokers, direct enrollment entities, and assisters that help Marketplace consumers. This final rule also includes several policies impacting the Medicaid program, Children’s Health Insurance Program (CHIP), and the Basic Health Program (BHP). These changes further the Biden-Harris Administration’s goals of advancing health equity by addressing the health disparities that underlie our health system. The policies build on the Affordable Care Act’s promise to expand access to quality, affordable health coverage and care by increasing access to health care services, simplifying choice, and improving the plan selection process, making it easier to enroll in coverage, enhancing standards and guaranteed consumer protections, reinterpreting the authority to access certain data through Medicaid, CHIP, and Marketplace Hub services, and strengthening markets.",
  },
);
