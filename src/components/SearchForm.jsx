import React, { useState, useContext } from "react";
import {
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import { FlightContext } from "../context/FlightContext";
import { searchAirport, searchFlights } from "../api/api";

const SearchForm = () => {
  const { setFlightData, setLoading, setError } = useContext(FlightContext);

  const [originOptions, setOriginOptions] = useState([]);
  const [destinationOptions, setDestinationOptions] = useState([]);

  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [departureDate, setDepartureDate] = useState("");

  const [loadingOrigin, setLoadingOrigin] = useState(false);
  const [loadingDestination, setLoadingDestination] = useState(false);

  // Fetch autocomplete options when user types in the "origin" input
  const handleOriginInputChange = async (event, value) => {
    if (value.length < 2) return;
    setLoadingOrigin(true);
    try {
      const options = await searchAirport(value);
      setOriginOptions(options);
    } catch (err) {
      console.error("Origin search error:", err);
    } finally {
      setLoadingOrigin(false);
    }
  };

 // Fetch autocomplete options when user types in the "destination" input
  const handleDestinationInputChange = async (event, value) => {
    if (value.length < 2) return;
    setLoadingDestination(true);
    try {
      const options = await searchAirport(value);
      setDestinationOptions(options);
    } catch (err) {
      console.error("Destination search error:", err);
    } finally {
      setLoadingDestination(false);
    }
  };

  const handleSearch = async () => {
  if (!origin || !destination || !departureDate) {
    setError("All fields are required");
    return;
  }

  setLoading(true);
  setError(null);

  try {
    const flights = await searchFlights({
      originSkyId: origin.skyId,
      destinationSkyId: destination.skyId,
      originEntityId: origin.entityId,
      destinationEntityId: destination.entityId,
      date: departureDate
    });

    console.log("API raw response:", flights);

    if (!Array.isArray(flights) || flights.length === 0) {
      setError("No flights found");
      setFlightData([]); // clear previous results
    } else {
      setFlightData(flights);
    }
  } catch (err) {
    console.error("Flight search error:", err);
    setError(err.message || "Failed to fetch flights");
    setFlightData([]);
  } finally {
    setLoading(false);
  }
};


  return (
    <Box sx={{ p: 3 }}>
        <pre>{JSON.stringify(origin)}</pre>
        <pre>{JSON.stringify(destination)}</pre>
      <Typography variant="h5" gutterBottom>
        Flight Search
      </Typography>
      <Grid container spacing={2}>
        <Grid xs={12} md={4}>
          <Autocomplete
            options={originOptions}
            loading={loadingOrigin}
            onInputChange={handleOriginInputChange}
            onChange={(event, value) => setOrigin(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Origin"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingOrigin ? <CircularProgress size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  )
                }}
              />
            )}
          />
        </Grid>
        
        <Grid xs={12} md={4}>
          <Autocomplete
            options={destinationOptions}
            loading={loadingDestination}
            onInputChange={handleDestinationInputChange}
            onChange={(event, value) => setDestination(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Destination"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingDestination ? <CircularProgress size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  )
                }}
              />
            )}
          />
        </Grid>
        <Grid xs={12} md={4}>
          <TextField
            fullWidth
            label="Departure Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
          />
        </Grid>
        <Grid xs={12}>
          <Button variant="contained" onClick={handleSearch}>
            Search Flights
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SearchForm;
