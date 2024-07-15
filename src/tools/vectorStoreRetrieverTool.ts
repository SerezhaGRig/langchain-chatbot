import { createRetrieverTool } from "langchain/tools/retriever";
import { vectorStore } from "../vectorStore";

const files: {
  source: string;
  description: string;
  name: string;
}[] = [
  {
    source: "Notice of Benefit and Payment Parameters for 2025 Final Rule",
    name: "notice-of-benefit-and-payment-parameters-for-2025-final-rule",
    description:
      "Public Law 111-148 mandates that the summary of benefits and coverage for health plans be presented in a uniform format, not exceeding 4 pages and using at least 12-point font, and in a manner that is culturally and linguistically appropriate for the average plan enrollee. The summary must include key elements such as uniform definitions of insurance terms, descriptions of coverage and cost-sharing, exceptions and limitations, renewability provisions, coverage facts labels, and contact information for further inquiries.",
  },
  {
    source: "ACA Law act",
    name: "aca-law-act",
    description:
      "This publication explains how to claim the itemized deduction for medical and dental expenses on Schedule A (Form 1040), including which expenses qualify, how to handle reimbursements, and how to report the deduction. It also provides guidance on related topics such as impairment-related work expenses, health insurance premiums for the self-employed, and how to seek further tax assistance.",
  },
  {
    source: "Medicaid & Dental benefits",
    name: "medicaid-dental-benefits",
    description:
      "Preventive health care, including screenings, check-ups, and counseling, is essential for preventing and detecting illnesses early when treatment is most effective, and for promoting overall well-being through healthy lifestyle choices. Having a trusted provider can help you get the right preventive services, improve your mental and emotional health, and achieve your wellness goals, while keeping your health information organized and secure is also crucial.",
  },
  {
    source: "From coverage to Care",
    name: "coverage-to-care",
    description:
      'A provider network is a list of doctors, health care providers, and hospitals that a health plan contracts with to offer medical care to its members, known as "network providers" or "in-network providers." To see if your doctor is in a plan’s network before choosing a Health Insurance Marketplace® plan, make a list of your providers, search the provider network for each specific plan, or call the insurance company’s customer service, and compare plans on HealthCare.gov.',
  },
  {
    source: "What you should know about providers",
    name: "provider-info",
    description:
      "The contents of this document are intended to provide clarity regarding existing legal requirements and do not have the force of law unless incorporated into a contract, and it will not supersede any state or QHP issuer requirements for commission payments. Agents and brokers assisting consumers with Marketplace coverage must document consumer consent before accessing their information, with various acceptable formats for documentation, and this model consent form serves as an example for physical documentation with wet signatures.",
  },
  {
    source:
      "Patient Protection and Affordable Care Act, HHS Notice of Benefit and Payment Parameters for 2024",
    name: "aca-hhs-2024",
    description:
      "The HHS Notice of Benefit and Payment Parameters for 2025 final rule, released by CMS, sets new standards for issuers and Marketplaces and includes policies impacting Medicaid, CHIP, and the Basic Health Program. These changes aim to advance health equity by increasing access to healthcare services, simplifying choice, improving plan selection, and enhancing consumer protections.",
  },
  {
    source: "regs to implement equal employemnt provision",
    name: "equal-employment-regs",
    description:
      "The EEOC has issued final revised regulations and interpretive guidance to implement the ADA Amendments Act of 2008, which enhances the enforcement of title I of the ADA prohibiting employment discrimination based on disability. These regulations will become effective on May 24, 2011, and further information can be obtained by contacting the EEOC's Office of Legal Counsel.",
  },
];
export const retrieverTools = files.map((file) =>
  createRetrieverTool(
    vectorStore.asRetriever({
      filter: {
        where: {
          operator: "Like",
          path: ["source"],
          valueText: `*${file.source}*`,
        },
      },
    }),
    {
      name: file.name,
      description: file.description,
    },
  ),
);
