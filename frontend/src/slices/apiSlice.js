import {
  createApi,
  fetchBaseQuery,
  setupListeners,
} from "@reduxjs/toolkit/query/react";
import axios from "axios";

const base =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000/"
    : "https://mern-stack-redux-blog.onrender.com/";

//
const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: base || "",
    credentials: "include",
  }),
  tagTypes: ["users", "blogs", "comments"],

  endpoints: (builder) => ({}),
});

export default apiSlice;
