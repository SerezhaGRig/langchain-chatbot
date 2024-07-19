import { Response } from "./types";

export const createDocumentFromResponse = (response: Response): string => {
  const plans = response.plans
    .map((plan) => {
      return `
        Plan ID: ${plan.id}
        Name: ${plan.name}
        Benefits: ${plan.benefits
          .map(
            (benefit) => `
            Benefit Name: ${benefit.name}
            Covered: ${benefit.covered}
            Cost Sharings: ${benefit.cost_sharings
              .map(
                (costSharing) => `
                Coinsurance Options: ${costSharing.coinsurance_options}
                Coinsurance Rate: ${costSharing.coinsurance_rate}
                Copay Amount: ${costSharing.copay_amount}
                Copay Options: ${costSharing.copay_options}
                Network Tier: ${costSharing.network_tier}
                CSR: ${costSharing.csr}
                Display String: ${costSharing.display_string}
            `,
              )
              .join("\n")}
            Explanation: ${benefit.explanation}
            Exclusions: ${benefit.exclusions}
            Has Limits: ${benefit.has_limits}
            Limit Unit: ${benefit.limit_unit}
            Limit Quantity: ${benefit.limit_quantity}
        `,
          )
          .join("\n")}
        Disease Management Programs: ${plan.disease_mgmt_programs.join(", ")}
        Has National Network: ${plan.has_national_network}
        Quality Rating: ${
          plan.quality_rating.available
            ? `
            Year: ${plan.quality_rating.year}
            Global Rating: ${plan.quality_rating.global_rating}
        `
            : "Not Available"
        }
        Premium: ${plan.premium}
        State: ${plan.state}
        Type: ${plan.type}
        `;
    })
    .join("\n\n");

  return `
    Total Plans: ${response.total}
    Rate Area: ${response.rate_area.state} ${response.rate_area.area}
    Ranges: 
        Premiums: Min - ${response.ranges.premiums.min}, Max - ${response.ranges.premiums.max}
        Deductibles: Min - ${response.ranges.deductibles.min}, Max - ${response.ranges.deductibles.max}

    Plans:
    ${plans}
    `;
};
