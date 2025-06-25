import React, { useState, useContext, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  Autocomplete,
  CircularProgress,
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@mui/material";
import { FlightContext } from "../context/FlightContext";
import { searchAirport, searchFlights } from "../api/api";

const SearchForm = () => {
  const { setFlightData, setLoading, setError } = useContext(FlightContext);
  const [tripType, setTripType] = useState("oneway");
  const [returnDate, setReturndate] = useState("");

  const [originOptions, setOriginOptions] = useState([]);
  const [destinationOptions, setDestinationOptions] = useState([]);

  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [departureDate, setDepartureDate] = useState("");

  const [loadingOrigin, setLoadingOrigin] = useState(false);
  const [loadingDestination, setLoadingDestination] = useState(false);

  //Initialize fields from localStorage
  useEffect(() => {
    const storedTripType = localStorage.getItem("tripType");
    const storedOrigin = localStorage.getItem("origin");
    const storedDestination = localStorage.getItem("destination");
    const storedDepartureDate = localStorage.getItem("departureDate");
    const storedReturnDate = localStorage.getItem("returnDate");

    if (storedTripType) setTripType(storedTripType);
    if (storedOrigin) setOrigin(JSON.parse(storedOrigin));
    if (storedDestination) setDestination(JSON.parse(storedDestination));
    if (storedDepartureDate) setDepartureDate(storedDepartureDate);
    if (storedReturnDate) setReturndate(storedReturnDate);
  }, []);

  // handle Trip type change
  const handleTripTypeChange = (value) => {
    setTripType(value);
    localStorage.setItem("tripType", value);
  };

  // handle Origin change
  const handleOriginChange = (value) => {
    setOrigin(value);
    localStorage.setItem("origin", JSON.stringify(value));
  };

  // handle Destination change
  const handleDestinationChange = (value) => {
    setDestination(value);
    localStorage.setItem("destination", JSON.stringify(value));
  };

  // handle departure Date change
  const handleDepartureDateChange = (e) => {
    setDepartureDate(e.target.value);
    localStorage.setItem("departureDate", e.target.value);
  };

  // handle return Date change
  const handleReturnDateChange = (e) => {
    setReturndate(e.target.value);
    localStorage.setItem("returnDate", e.target.value);
  };

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

  //Search function
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
        date: departureDate,
        returnDate: tripType === "roundtrip" ? returnDate : null,
      });

      console.log("API raw response:", flights);

      if (!Array.isArray(flights) || flights.length === 0) {
        setError("No flights found");
        setFlightData([]);
      } else {
        let results = [...flights];
        setFlightData(results);
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
    <Box
      sx={{
        p: 3,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        borderRadius: 2,
        mb: 6,
        border: "1px solid #bbb",
      }}
    >
      <Box sx={{ position: "relative", zIndex: 2 }}>
        <Typography variant="h5" gutterBottom>
          Flight Search
        </Typography>
      </Box>

      {/* radio group */}
      <FormControl component="fieldset" sx={{ mt: 2, display: "flex" }}>
        <RadioGroup
          row
          value={tripType}
          onChange={(e) => handleTripTypeChange(e.target.value)}
        >
          <FormControlLabel
            value="oneway"
            control={<Radio />}
            label="One-way"
          />
          <FormControlLabel
            value="roundtrip"
            control={<Radio />}
            label="Round-trip"
          />
        </RadioGroup>
      </FormControl>

      {/* input fields */}
      <Grid container spacing={2} mt={1.5}>
        {/* origin */}
        <Grid size={{ xs: 12, md: 4, lg: 3 }}>
          <Autocomplete
            value={origin}
            sx={{ backgroundColor: "fff", borderRadius: 2 }}
            options={originOptions}
            loading={loadingOrigin}
            onInputChange={handleOriginInputChange}
            onChange={(event, value) => handleOriginChange(value)}
            renderInput={(params) => (
              <TextField
                sx={{
                  backgroundColor: "fff",
                  borderRadius: 2,
                }}
                {...params}
                label="Origin"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingOrigin ? <CircularProgress size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Grid>

        {/* destination */}
        <Grid size={{ xs: 12, md: 4, lg: 3 }}>
          <Autocomplete
            value={destination}
            options={destinationOptions}
            loading={loadingDestination}
            onInputChange={handleDestinationInputChange}
            onChange={(event, value) => handleDestinationChange(value)}
            sx={{ backgroundColor: "fff", borderRadius: 2 }}
            renderInput={(params) => (
              <TextField
                fullWidth
                {...params}
                sx={{
                  backgroundColor: "fff",
                  borderRadius: 2,
                }}
                label="Destination"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingDestination ? (
                        <CircularProgress size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Grid>

        {/* departure date */}
        <Grid size={{ xs: 12, md: 4, lg: 3 }}>
          <TextField
            sx={{
              backgroundColor: "fff",
              borderRadius: 2,
            }}
            fullWidth
            label="Departure Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={departureDate}
            onChange={handleDepartureDateChange}
          />
        </Grid>

        {/* return date */}
        {tripType === "roundtrip" && (
          <Grid size={{ xs: 12, md: 4, lg: 3 }}>
            <TextField
              sx={{
                backgroundColor: "fff",
                borderRadius: 2,
              }}
              fullWidth
              label="Return Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={returnDate}
              onChange={handleReturnDateChange}
            />
          </Grid>
        )}

        <Grid size={{ xs: 12, md: 4, lg: 3 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleSearch}
            sx={{
              textTransform: "inherit",
              py: 1.5,
              px: 4,
              fontWeight: "bold",
              fontSize: "1rem",
              borderRadius: 2,
            }}
          >
            Search Flights
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SearchForm;
