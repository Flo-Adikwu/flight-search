import { createContext, useState, useEffect } from "react";

// Create the context object
export const FlightContext = createContext();

// Create the provider component to wrap the app and share flight-related state
export const FlightProvider = ({ children }) => {
  const [flightData, setFlightData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("flightData");
    if (saved) {
      try {
        setFlightData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse flight data:", e);
      }
    }
  }, []);

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
