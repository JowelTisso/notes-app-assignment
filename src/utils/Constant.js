import dayjs from "dayjs";

// API
const BASE_URL = "https://62f90485e05644803530f34a.mockapi.io/api/";

export const API = Object.freeze({
  NOTES: `${BASE_URL}notes`,
  PINNED: `${BASE_URL}pinned`,
});

// Colors
export const COLOR = Object.freeze({
  yellow: "#fef08a",
  green: "#bbf7d0",
  pink: "#fbcfe8",
  white: "#fff",
  cyan: "#36D7B7",
});

// createdAt Date
export const formatDate = () => dayjs().format("YYYY-MM-DDTHH:mm:ssZ");
