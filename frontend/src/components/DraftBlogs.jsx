import React from "react";
import BlogCard from "./BlogCard";

const DraftBlogs = ({ draftBlogs }) => {
  console.log(draftBlogs);
  return (
    <>
      {draftBlogs?.length !== 0 ? (
        draftBlogs.map((blog) => <BlogCard blog={blog} />)
      ) : (
        <p>There Is No Draft Blogs</p>
      )}
    </>
  );
};

export default DraftBlogs;
