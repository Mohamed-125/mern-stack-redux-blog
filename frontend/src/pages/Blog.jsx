import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  useCreateCommentMutation,
  useGetBlogQuery,
  useUpdateCommentMutation,
} from "../slices/blogsApiSlice";
import { Container } from "react-bootstrap";
import Loader from "../components/Loader.jsx";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Embed from "@editorjs/embed";
import Image from "@editorjs/image";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
import { useSelector } from "react-redux";
import { AiFillLike } from "react-icons/ai";
import { AiOutlineLike } from "react-icons/ai";
import {
  FacebookShareButton,
  WhatsappShareButton,
  InstapaperShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  LinkedinIcon,
} from "react-share";

import {
  FacebookIcon,
  InstapaperIcon,
  TelegramIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useDeleteBlogMutation } from "../slices/blogsApiSlice";

const Blog = () => {
  const id = useParams().id;
  const { data: blog, isLoading, error } = useGetBlogQuery(id);
  const [updateComment] = useUpdateCommentMutation();
  const [comments, setComments] = useState(blog?.comments || []);
  const [isLiked, setIsLiked] = useState([]);
  const [createComment] = useCreateCommentMutation();
  const user = useSelector((state) => state.auth.user);
  const textRef = useRef();

  const editor = useMemo(() => {
    new EditorJS({
      holder: "editorjs",
      data: blog?.data,
      tools: {
        header: {
          class: Header,
          config: {
            placeholder: "Type Heading ...",
            levels: [2, 3],
            defaultLevel: 2,
          },
          inlineToolbar: true,
        },
        embed: Embed,
        image: {
          class: Image,
        },
        Quote: {
          class: Quote,
          inlineToolbar: true,
        },
        marker: Marker,
        inlineCode: InlineCode,
        list: {
          class: List,
          inlineToolbar: true,
        },
      },
      readOnly: true,
    });
  }, []);
  useEffect(() => {
    console.log(blog);
    setComments(blog?.comments);
  }, [blog]);

  useEffect(() => {
    comments?.map((comment) => {
      if (comment?.likes?.includes(user._id))
        setIsLiked((pre) => [...pre, comment._id]);
    });
  }, [comments]);

  const [deleteBlog] = useDeleteBlogMutation();

  if (error) return <p>error</p>;
  if (isLoading) return <Loader />;

  const addComment = async (e) => {
    e.preventDefault();
    const text = textRef.current.value;
    try {
      const res = await createComment({ text, blog: blog._id }).unwrap();
      console.log(res);
      setComments((pre) => {
        console.log(pre);
        return [
          ...pre,
          {
            _id: res._id,
            user,
            text: res.text,
            createdAt: res.createdAt,
            likes: res.likes,
          },
        ];
      });
    } catch (err) {
      console.log(err);
    }
  };

  const likeHandler = async (id, likes) => {
    try {
      const res = await updateComment({ id, likes }).unwrap();
      console.log(res);
      // setComments((pre) => [...pre, res]);
    } catch (err) {}
  };

  const unLikeHandler = async (id, likes) => {
    console.log(likes);
    try {
      const res = await updateComment({ id, likes }).unwrap();
      console.log(res);
      // setComments((pre) => pre.filter((comment) => comment._id !== res._id));
    } catch (err) {}
  };

  return (
    <Container className="px-5 mb-5 blogContainer">
      <img src={blog.bannerImg} className="object-cover w-full" />
      <h1 className="mt-5 text-4xl">{blog.title}</h1>
      <hr />
      <div className="flex items-center gap-2">
        <img src={blog.user.profileImg} className="w-10 h-10 rounded-full" />
        <Link
          to={"/profile/" + blog.user._id}
          className="text-decoration-underline "
        >
          {blog.user.username}
        </Link>
      </div>
      {blog.user._id === user?._id ? (
        <>
          <hr />
          <div className="flex gap-3 text-4xl">
            <Link to={"/blogs/edit/" + blog._id} state={{ blog }}>
              <FaEdit className="text-blue-900" />
            </Link>
            <button
              onClick={async () => {
                const res = await deleteBlog(blog._id).unwrap();
                console.log(res);
              }}
            >
              <MdDelete className="text-red-600" />
            </button>
          </div>
        </>
      ) : null}{" "}
      <hr />
      {/* share icons */}
      <div className="flex gap-1">
        <FacebookShareButton
          url="https://monkeytype.com/"
          children={<FacebookIcon round={true} size={42} />}
        />
        <LinkedinShareButton
          url="https://monkeytype.com/"
          windowHeight={500}
          windowWidth={800}
          children={<LinkedinIcon round={true} size={42} />}
        />
        <WhatsappShareButton
          url="https://monkeytype.com/"
          windowHeight={500}
          windowWidth={800}
          children={<WhatsappIcon round={true} size={42} />}
        />

        <TwitterShareButton
          url="https://monkeytype.com/"
          windowHeight={500}
          windowWidth={800}
          children={<TwitterIcon round={true} size={42} />}
        />
      </div>
      <hr />
      <p>{blog?.createdAt ? new Date(blog?.createdAt).toDateString() : null}</p>
      <div id="editorjs"></div>
      <h3>Comments : {comments?.length || 0} </h3>
      <form onSubmit={addComment}>
        <input
          type="text"
          ref={textRef}
          placeholder="type your comment"
          className="w-full px-2 py-1 mb-4"
        />
      </form>
      {comments?.length ? (
        comments?.map((comment) => {
          return (
            <div key={comment._id} className="mb-3 border-b-2 border-gray-300">
              <div className="flex justify-between gap-3 text-right">
                <div className="flex-1">
                  <Link
                    className="text-decoration-underline text-gray-800 text-[15.5px]"
                    to={`/profile/${comment.user._id}`}
                  >
                    {comment.user.username}
                  </Link>
                  <p>{comment.text}</p>
                </div>

                <img
                  className="rounded-full w-14 h-14"
                  src={comment.user.profileImg}
                />
              </div>
              <div className="">
                <p className="flex items-center justify-end gap-3">
                  {isLiked?.includes(comment._id) ? (
                    <>
                      <AiFillLike
                        className="text-2xl cursor-pointer "
                        onClick={() => {
                          setIsLiked((pre) => {
                            return pre?.filter(
                              (likedComment) => likedComment !== comment._id
                            );
                          });
                          unLikeHandler(
                            comment._id,
                            comment.likes.filter(
                              (Likeduser) => Likeduser !== user._id
                            )
                          );
                        }}
                      />{" "}
                    </>
                  ) : (
                    <>
                      <AiOutlineLike
                        className="text-2xl cursor-pointer "
                        onClick={() => {
                          setIsLiked((pre) => [...pre, comment._id]);
                          likeHandler(comment._id, [
                            ...comment?.likes,
                            user._id,
                          ]);
                        }}
                      />
                    </>
                  )}{" "}
                  {+comment.likes.length === 0
                    ? isLiked?.includes(comment._id)
                      ? +comment.likes.length + 1
                      : +comment.likes.length
                    : isLiked?.includes(comment._id)
                    ? +comment.likes.length
                    : +comment.likes.length - 1}
                </p>
              </div>
            </div>
          );
        })
      ) : (
        <p>write the first comment </p>
      )}
    </Container>
  );
};

export default Blog;
