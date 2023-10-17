import moment from "moment";

export const formatRelative = (date: Date) => {
  return moment(date).fromNow();
};

export const formatDayDate = (date: Date) => {
  return moment(date).format("dddd, MMM Do");
};

export const formatTime = (date: Date) => {
  return moment(date).format("h:mma");
};
