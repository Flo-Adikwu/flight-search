import React, { useContext, useEffect, useState, useMemo } from "react";
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
  Pagination,
  TextField,
} from "@mui/material";
import { FlightContext } from "../context/FlightContext";
import moment from "moment";
import { getFlightDuration } from "../utils/getFlightDuration";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const SearchResults = () => {
  const { flightData, loading, error } = useContext(FlightContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState("");
  const resultsPerPage = 5;
  const flights = useMemo(() => flightData || [], [flightData]);
  const totalPages = Math.ceil(flights.length / resultsPerPage);
  const [expandedRow, setExpandedRow] = useState(null);

  //reset page to 1 when page loads
  useEffect(() => {
    setCurrentPage(1);
  }, [flightData]);

  const sortedFlights = useMemo(() => {
    let sorted = [...flights];

    if (sort === "price") {
      sorted.sort((a, b) => a.price.raw - b.price.raw);
    } else if (sort === "duration") {
      sorted.sort((a, b) => {
        const aDuration = moment(a.legs[0].arrival).diff(
          moment(a.legs[0].departure)
        );
        const bDuration = moment(b.legs[0].arrival).diff(
          moment(b.legs[0].departure)
        );
        return aDuration - bDuration;
      });
    } else if (sort === "stops") {
      sorted.sort((a, b) => a.legs[0].stopCount - b.legs[0].stopCount);
    }

    return sorted;
  }, [flights, sort]);

  const paginatedFlightList = useMemo(() => {
    return sortedFlights.slice(
      (currentPage - 1) * resultsPerPage,
      currentPage * resultsPerPage
    );
  }, [sortedFlights, currentPage]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleToggleDetails = (rowIndex) => {
    setExpandedRow((prev) => (prev === rowIndex ? null : rowIndex));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <>
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
      <Box>
        <Typography variant="h4"> All Flights</Typography>
        <Typography variant="body">
          Prices include required taxes + fees for 1 adult. Optional charges and
          bag fees may apply. Passenger assistance info.
        </Typography>
      </Box>
      <Box display="flex" justifyContent="flex-end" mt={4}>
        <TextField
          select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          SelectProps={{ native: true }}
          size="small"
          sx={{ width: 200 }}
        >
          <option value="">None</option>
          <option value="price">Price (Low to High)</option>
          <option value="duration">Duration (Short to Long)</option>
          <option value="stops">Stops (Fewest to Most)</option>
        </TextField>
      </Box>
      <TableContainer
        component={Paper}
        elevation={3}
        sx={{
          border: "1px solid #bbb",
          mt: 2,

          borderRadius: 2,
          boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
          overflow: "hidden",
          overflowX: "auto",
          mx: "auto",
          width: "100%",
        }}
      >
        <Table>
          <TableHead sx={{ background: "#f5f5f5" }}>
            <TableRow>
              <TableCell
                sx={{ fontWeight: "bold", fontSize: "18px", color: "#333" }}
              >
                Airline
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", fontSize: "18px", color: "#333" }}
              >
                Duration
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", fontSize: "18px", color: "#333" }}
              >
                Stops
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", fontSize: "18px", color: "#333" }}
              >
                Price
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedFlightList.map((flight, i) => {
              const leg = flight.legs?.[0] || {};
              const departure = moment(leg.departure);
              const arrival = moment(leg.arrival);
              const nextDay = arrival.isAfter(departure, "day") ? " +1" : "";
              return (
                <>
                  <TableRow
                    key={i}
                    onClick={() => handleToggleDetails(i)}
                    sx={{
                      cursor: "pointer",
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
                        <Box
                          display="flex"
                          alignItems="center"
                          gap={1}
                          mt={0.5}
                        >
                          {leg.carriers?.marketing?.length ? (
                            <Box display="flex" alignItems="center" gap={1}>
                              <img
                                src={leg.carriers.marketing[0].logoUrl}
                                alt={leg.carriers.marketing[0].name}
                                style={{
                                  width: 30,
                                  height: 30,
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
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        color="primary"
                      >
                        {flight.price?.formatted || "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {expandedRow === i ? (
                        <ExpandLessIcon />
                      ) : (
                        <ExpandMoreIcon />
                      )}
                    </TableCell>
                  </TableRow>
                  {expandedRow === i && (
                    <TableRow>
                      <TableCell
                        colSpan={12}
                        sx={{ backgroundColor: "#fafafa" }}
                      >
                        <Box p={2}>
                          <Typography variant="subtitle1" gutterBottom>
                            Flight Details
                          </Typography>
                          <img
                            src={leg.carriers.marketing[0].logoUrl}
                            alt={leg.carriers.marketing[0].name}
                            style={{
                              width: 40,
                              height: 40,
                              objectFit: "contain",
                            }}
                          />
                          <Typography variant="body2">
                            Aircraft: {leg.carriers.marketing[0].name || "N/A"}
                          </Typography>
                          <Box display="flex">
                            <Typography variant="body2">
                              Route: {leg.segments[0].origin.name || "N/A"}
                              {` ${leg.segments[0].origin.type || "N/A"} to `}
                            </Typography>
                            <Typography variant="body2" ml={0.5}>
                              {leg.segments[0].destination.name || "N/A"}
                              {` ${leg.segments[0].destination.type || "N/A"}`}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              );
            })}
          </TableBody>
        </Table>
        {totalPages > 1 && (
          <Box
            display="flex"
            justifyContent="flex-end"
            // mt={3}
            sx={{ padding: "20px" }}
          >
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(event, value) => handlePageChange(event, value)}
              variant="outlined"
              color="primary"
              size="large"
            />
          </Box>
        )}
      </TableContainer>
    </>
  );
};

export default SearchResults;
