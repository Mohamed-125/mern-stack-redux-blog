import apiSlice from "./apiSlice";

export const blogsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // get all blogs

    getBlogs: builder.query({
      query: () => {
        return {
          url: "blogs",
        };
      },
      keepUnusedDataFor: 120,
    }),

    getBlog: builder.query({
      query: (id) => {
        return {
          url: "blogs/" + id,
        };
      },
      keepUnusedDataFor: 120,
    }),

    // create new blog

    createBlog: builder.mutation({
      query: (blogData) => {
        return {
          url: "blogs/new",
          method: "POST",
          body: blogData,
        };
      },
      providesTags: ["blogs"],
    }),

    // edit blog

    editBlog: builder.mutation({
      query: (Bdata) => {
        const { id, data } = Bdata;

        return {
          url: "blogs/" + id,
          method: "PUT",
          body: data,
        };
      },
      providesTags: ["blogs"],
    }),

    // delete blog

    deleteBlog: builder.mutation({
      query: (id) => {
        return {
          url: "blogs/" + id,
          method: "DELETE",
        };
      },
      providesTags: ["blogs"],
    }),

    // create comment

    createComment: builder.mutation({
      query: (data) => {
        return {
          url: "comments/new",
          method: "POST",
          body: {
            text: data.text,
            user: data.user,
            blog: data.blog,
          },
        };
      },
    }),
    // update comment

    updateComment: builder.mutation({
      query: (data) => {
        return {
          url: "comments/" + data.id,
          method: "PUT",
          body: {
            text: data?.text,
            likes: data?.likes,
          },
        };
      },
    }),
    deleteComment: builder.mutation({
      query: (data) => {
        return {
          url: "comments/" + data.id,
          method: "PUT",
          body: {
            text: data?.text,
            user: data?.like,
          },
        };
      },
    }),
  }),
});

export const {
  useGetBlogsQuery,
  useGetBlogQuery,
  useCreateBlogMutation,
  useEditBlogMutation,
  useDeleteBlogMutation,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = blogsApiSlice;
