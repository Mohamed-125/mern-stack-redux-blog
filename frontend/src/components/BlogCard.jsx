import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const BlogCard = ({ blog }) => {
  const user = useSelector((state) => state.auth.user);
  console.log(blog);
  return (
    <Link
      key={blog._id}
      to={"/blog/" + blog._id}
      className="flex overflow-hidden shadow-md gap-2 mb-4 rounded-md sm:gap-0 border-1 border-slate-400 sm:!flex-col"
    >
      <div>
        <img
          src={blog.bannerImg}
          className="2xl:w-[340px] h-[250px] max-h-[350px] sm:!h-[unset] sm:min-w-none sm:w-full sm:aspect-square sm:max-w-none object-cover"
        />
      </div>
      <div className="flex-1 px-3 py-3 ">
        <h3>{blog.title}</h3>
        <p>{blog?.createdAt}</p>
        <p className="break-words">{blog.description}</p>
      </div>
    </Link>
  );
};

export default BlogCard;
