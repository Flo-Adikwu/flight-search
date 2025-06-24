import React, { useContext } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  Typography,
  CircularProgress,
  Box,
  TableContainer,
  TableBody,
  Paper,
} from "@mui/material";
import { FlightContext } from "../context/FlightContext";
import moment from "moment";
import { getFlightDuration } from "../utils/getFlightDuration";

const SearchResults = () => {
  const { flightData, loading, error } = useContext(FlightContext);
  const flights = flightData || [];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <>
          <Typography> ✈️</Typography>
          <CircularProgress />
        </>
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" mt={4}>
        {error}
      </Typography>
    );
  }

  if (!flights || flights.length === 0) {
    return (
      <Typography color="error" align="center" mt={4}>
        No flights to show
      </Typography>
    );
  }

  return (
    <>
      <Typography variant="h4"> All Flights</Typography>
      <Typography variant="body">
        Prices include required taxes + fees for 1 adult. Optional charges and
        bag fees may apply. Passenger assistance info.
      </Typography>
      <TableContainer
        component={Paper}
        elevation={3}
        sx={{
          mt: 4,
          borderRadius: 2,
          boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ background: "#f5f5f5" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                Airline
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                Duration
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                Stops
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                Price
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {flights.map((flight, i) => {
              const leg = flight.legs?.[0] || {};
              const departure = moment(leg.departure);
              const arrival = moment(leg.arrival);
              const nextDay = arrival.isAfter(departure, "day") ? " +1" : "";
              return (
                <TableRow
                  key={i}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#f9f9f9",
                    },
                  }}
                >
                  <TableCell>
                    <Box display="flex" flexDirection="column">
                      <Typography variant="h5" fontWeight="bold">
                        {`${departure.format("h:mm A")} – ${arrival.format(
                          "h:mm A"
                        )}${nextDay}`}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                        {leg.carriers?.marketing?.length ? (
                          <Box display="flex" alignItems="center" gap={1}>
                            <img
                              src={leg.carriers.marketing[0].logoUrl}
                              alt={leg.carriers.marketing[0].name}
                              style={{
                                width: 24,
                                height: 24,
                                objectFit: "contain",
                              }}
                            />
                            <Typography variant="body2" fontWeight={500}>
                              {leg.carriers.marketing[0].name}
                            </Typography>
                          </Box>
                        ) : (
                          "N/A"
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" flexDirection="column">
                      <Typography variant="h6">
                        {getFlightDuration(leg.departure, leg.arrival)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {`${leg.origin?.id || "N/A"} – ${
                          leg.destination?.id || "N/A"
                        }`}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {leg.stopCount > 0
                        ? `${leg.stopCount} stop(s)`
                        : "Nonstop"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      {flight.price?.formatted || "N/A"}
                    </Typography>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default SearchResults;
