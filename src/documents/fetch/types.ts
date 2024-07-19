export interface CostSharing {
  coinsurance_options: string;
  coinsurance_rate: number;
  copay_amount: number;
  copay_options: string;
  network_tier: string;
  csr: string;
  display_string: string;
}

export interface Benefit {
  name: string;
  covered: boolean;
  cost_sharings: CostSharing[];
  explanation: string;
  exclusions: string;
  has_limits: boolean;
  limit_unit: string;
  limit_quantity: number;
}

export interface QualityRating {
  available: boolean;
  year?: number;
  global_rating?: number;
}

export interface Plan {
  id: string;
  name: string;
  benefits: Benefit[];
  disease_mgmt_programs: string[];
  has_national_network: boolean;
  quality_rating: QualityRating;
  premium: number;
  state: string;
  type: string;
}

export interface RateArea {
  state: string;
  area: number;
}

export interface Ranges {
  premiums: {
    min: number;
    max: number;
  };
  deductibles: {
    min: number;
    max: number;
  };
}

export interface Response {
  plans: Plan[];
  total: number;
  rate_area: RateArea;
  ranges: Ranges;
}
