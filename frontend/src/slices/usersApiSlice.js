import apiSlice from "./apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (userData) => {
        return {
          url: "auth/login",
          method: "POST",
          body: userData,
        };
      },
    }),
    register: builder.mutation({
      query: (userData) => {
        return {
          url: "auth/register",
          method: "POST",
          body: userData,
        };
      },
    }),
    logout: builder.mutation({
      query: () => {
        return {
          url: "auth/logout",
          method: "POST",
        };
      },
    }),
    getUser: builder.query({
      query: (id) => {
        return {
          url: "profile/" + id,
          method: "GET",
        };
      },
    }),
    editUser: builder.mutation({
      query: (data) => {
        return {
          url: "profile/" + data.userId,
          method: "PUT",
          body: data.data,
        };
      },
    }),
    unFollow: builder.mutation({
      query: (data) => {
        return {
          url: "profile/" + data.userId,
          method: "PUT",
          body: data.data,
        };
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetUserQuery,
  useEditUserMutation,
  useUnFollowMutation,
} = usersApiSlice;
