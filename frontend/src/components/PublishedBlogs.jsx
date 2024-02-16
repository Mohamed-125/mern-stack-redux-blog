import React from "react";
import BlogCard from "./BlogCard.jsx";
const PublishedBlogs = ({ publishedBlogs }) => {
  return (
    <>
      {publishedBlogs?.length !== 0 ? (
        publishedBlogs?.map((blog) => <BlogCard blog={blog} />)
      ) : (
        <p>There Is No Published Blogs</p>
      )}
    </>
  );
};

export default PublishedBlogs;
