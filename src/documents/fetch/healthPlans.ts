import axios from "axios";
import { createDocumentFromResponse } from "./responseFormatter";
import { calculateDOBFromAge } from "./dobCalculator";

export const getSearchHealthPlans = (apiKey: string) => {
  const searchHealthPlans = async ({
    zipCode,
    householdIncome,
    household,
    state,
    countyFips,
  }: {
    zipCode?: string;
    age?: number;
    countyFips?: string;
    household?: {
      age?: number;
      tobaccoUse?: boolean;
    }[];
    state?: string;
    householdIncome?: number;
  }): Promise<string> => {
    const endpoint = `https://marketplace.api.healthcare.gov/api/v1/plans/search?apikey=${apiKey}&year=2024`; // Replace with the actual API endpoint

    try {
      const { data } = await axios.post(endpoint, {
        place: {
          zipcode: zipCode,
          countyfips: countyFips, // This should be determined based on the zipcode, you might need an external service to get this
          state, // This should be determined based on the zipcode, you might need an external service to get this
        },
        household: {
          income: householdIncome, // Example income
          people: household.map((people) => ({
            age: people.age,
            dob: calculateDOBFromAge(people.age), // You can calculate DOB from age if needed
            uses_tobacco: people.tobaccoUse,
          })),
        },
        market: "Individual",
      });
      return createDocumentFromResponse(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };
  return searchHealthPlans;
};