import React, { useEffect } from "react";
import { useGetBlogsQuery } from "../slices/blogsApiSlice";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import BlogCard from "../components/BlogCard";
import Loader from "../components/Loader";
import axios from "axios";

const Home = () => {
  const { data: blogs, isLoading, error } = useGetBlogsQuery();
  if (error) return <p>{error.error}</p>;
  if (isLoading) return <Loader />;
  const publishedBlogs = blogs.filter((blog) => !blog.isDraft);

  return (
    <Container>
      {publishedBlogs?.map((blog) => (
        <BlogCard blog={blog} />
      ))}
    </Container>
  );
};

export default Home;
