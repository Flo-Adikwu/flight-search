import moment from "moment";

export const getFlightDuration = (departureTime, arrivalTime) => {
  const dep = moment(departureTime);
  const arr = moment(arrivalTime);
  const duration = moment.duration(arr.diff(dep));

  const hours = Math.floor(duration.asHours());
  const minutes = duration.minutes();

  return `${hours} hr ${minutes} min`;
};