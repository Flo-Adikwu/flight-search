import axios from "axios";

const SEARCH_FLIGHTS_BASE_URL =
  "https://sky-scrapper.p.rapidapi.com/api/v2/flights";
const SEARCH_AIRPORT_BASE_URL =
  "https://sky-scrapper.p.rapidapi.com/api/v1/flights";

const headers = {
  "X-RapidAPI-Key": "d24135865cmsh4500bdc074ce430p175d68jsndb28f05c32f8",
  "X-RapidAPI-Host": "sky-scrapper.p.rapidapi.com",
};

export const searchFlights = async ({
  originSkyId,
  destinationSkyId,
  originEntityId,
  destinationEntityId,
  date,
}) => {
  try {
    const response = await axios.get(
      `${SEARCH_FLIGHTS_BASE_URL}/searchFlights`,
      {
        params: {
          originSkyId,
          destinationSkyId,
          originEntityId,
          destinationEntityId,
          date,
          cabinClass: "economy",
          adults: "1",
          sortBy: "best",
          currency: "USD",
          market: "en-US",
          countryCode: "US",
        },
        headers,
      }
    );

    console.log("Raw API response:", response.data);

    if (response.data.status === false) {
      throw new Error(response.data.message || "Unknown API error");
    }

    // Return flights array correctly
    return response.data?.data?.itineraries || [];
  } catch (error) {
    console.error("Error in searchFlights:", error);
    throw error;
  }
};

// Search airport suggestions based on user input
export const searchAirport = async (query) => {
  const response = await axios.get(`${SEARCH_AIRPORT_BASE_URL}/searchAirport`, {
    params: { query, locale: "en-US" },
    headers,
  });

  return response.data.data.map((item) => {
    const flightParams = item.navigation.relevantFlightParams;
    return {
      label: item.presentation.suggestionTitle,
      skyId: flightParams.skyId,
      entityId: flightParams.entityId,
    };
  });
};
