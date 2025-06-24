import { createContext, useState, useEffect } from "react";

// Create the context object
export const FlightContext = createContext();

// Create the provider component to wrap the app and share flight-related state
export const FlightProvider = ({ children }) => {
  const [flightData, setFlightData] = useState(() => {
    const stored = localStorage.getItem("flightData");
    return stored ? JSON.parse(stored) : [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    localStorage.setItem("flightData", JSON.stringify(flightData));
  }, [flightData]);

  return (
    <FlightContext.Provider
      value={{
        flightData,
        setFlightData,
        loading,
        setLoading,
        error,
        setError,
      }}
    >
      {children}
    </FlightContext.Provider>
  );
};
