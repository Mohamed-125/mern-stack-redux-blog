import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Embed from "@editorjs/embed";
import Image from "@editorjs/image";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
import axios from "axios";
import { IoMdClose } from "react-icons/io";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEditBlogMutation, useGetBlogQuery } from "../slices/blogsApiSlice";
import Loader from "../components/Loader";
import {
  uploadImgByURL,
  uploadImgByFile,
  uploadToCloudinary,
} from "../utils/helpers";

const EditBlog = () => {
  const id = useParams().id;
  const [editBlog, { isLoading, error }] = useEditBlogMutation();
  const { data: blogData, isLoading: getBlogLoading } = useGetBlogQuery(id);
  const [editorError, setEditorError] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [rendered, setRendered] = useState(false);
  const [img, setImg] = useState();
  const [bannerImg, setBannerImg] = useState({});
  const [publishModel, setPublishModel] = useState(false);
  const [editorValue, setEditorValue] = useState([]);
  const [title, setTitle] = useState("");
  const [bannerImgUrl, setBannerImgUrl] = useState("");
  const [description, setDescription] = useState("");
  const [blog, setBlog] = useState({});
  const [editor, setEditor] = useState();

  // const editorRef = useRef(null); // Create a ref to hold the DOM element

  useEffect(() => {
    const editor2 = new EditorJS({
      holder: editor?.current?.id,

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
          config: {
            uploader: {
              uploadByUrl: uploadImgByURL,
              uploadByFile: uploadImgByFile,
            },
          },
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

      placeholder: "Type Here ...",
      onChange: async (api, event) => {
        let content = await api.saver.save();
        setEditorValue(content);
      },
      data: editorValue.length || blog?.data,
    });
    console.log(editorValue);

    return () => {
      editor2?.destroy?.(); // Clean up EditorJS instance when the component is unmounted
    };
  }, [blog, editor]);

  const blogLocation = useLocation()?.state?.blog;

  useEffect(() => {
    if (blogLocation?._id) {
      setBlog(blogLocation);
    } else {
      setBlog(blogData);
    }
    console.log(blogLocation, blogData);

    // setBlog( );
  }, [blogData, blogLocation]);

  useEffect(() => {
    console.log(blog?.data);
    console.log(blog);
    setTitle(blog?.title);
    setBannerImgUrl(blog?.bannerImg);
    setDescription(blog?.description);
  }, [blog]);

  if (getBlogLoading || isLoading) return <Loader />;

  const publishHandler = async (e) => {
    e.preventDefault();
    if (editorValue?.blocks?.length === 0) {
      setEditorError(true);
    }
    if (bannerImgUrl && editorValue.blocks.length > 0) {
      setPublishModel(true);
      setEditorError(false);
    }
    if (publishModel) {
      let url;

      if (bannerImg?.name) {
        url = await uploadToCloudinary(bannerImg);
      } else {
        url = bannerImgUrl;
      }
      console.log(isDraft);

      const blogData = isDraft
        ? {
            title: title.trim(),
            bannerImg: url,
            data: editorValue,
            description: description.trim(),
            isDraft: true,
          }
        : {
            title: title.trim(),
            bannerImg: url,
            data: editorValue,
            description: description.trim(),
            isDraft: false,
          };
      const res = await editBlog({ id: blog._id, data: blogData });
      console.log(res);
    }
  };

  return (
    <div className="container blogContainer">
      <form onSubmit={publishHandler}>
        {publishModel ? (
          <div
            className="fixed flex 
          justify-center
          flex-col inset-0 z-[300] bg-gray-100"
          >
            <IoMdClose
              className="absolute text-4xl cursor-pointer top-11 right-8"
              onClick={() => {
                setPublishModel(false);
                setIsDraft(false);
              }}
            />

            <div
              // onSubmit={submitHandler}
              className="container flex flex-row justify-center gap-10 md:gap-7 md:pt-24 md:flex-col"
            >
              <div className="flex flex-col justify-center flex-1 ">
                <img
                  className="object-cover min-h-96 rounded-3xl mb-3 max-h-[350px]"
                  src={bannerImgUrl}
                />
                <h2>{title}</h2>
                <p style={{ wordBreak: "break-word" }} className="">
                  {description}
                </p>
              </div>
              <div className="flex flex-col justify-center flex-1 gap-4 ">
                <div>
                  <h3>Title</h3>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                    className="w-full mt-2"
                  />
                </div>

                <div>
                  <h3>Description</h3>
                  <div>
                    <textarea
                      required
                      className="w-full h-48 px-3 py-3 mt-2"
                      onChange={(e) => {
                        setDescription(e.target.value);
                      }}
                      value={description}
                      maxLength={180}
                    ></textarea>
                    <p>{description.length} / 180</p>{" "}
                  </div>

                  <button className="w-56 my-6 text-white bg-black border border-black rounded-3xl">
                    {isDraft ? "Save As Draft" : "Publish"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="flex flex-col w-full gap-3 mb-8">
          <h2>Upload Blog Banner Image</h2>
          <input
            onChange={(e) => {
              setBannerImg(e.target.files[0]);
              setBannerImgUrl(URL.createObjectURL(e.target.files[0]));
            }}
            type="file"
            accept="image/*"
            className="mt-1 !py-8 bg-gray-200"
          />
        </div>

        <div className="flex flex-col w-full gap-3 mb-8">
          <h2> Blog Title</h2>

          <input
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            value={title}
            type="text"
            className="mb-5 border-t-0 border-b-2 border-l-0 border-r-0 border-gray-300 rounded-none focus-visible:outline-none"
            placeholder="Blog Title"
            required
            name="Blog Title"
          />
        </div>

        <h2>Type Your Blog </h2>
        <div
          id="editorjs"
          ref={setEditor}
          className="mt-4 lg:mx-6 sm:mx-0"
        ></div>
        {editorError ? (
          <p className="mt-4 text-red-400 ">You Have To Enter Blog Content</p>
        ) : null}
        <div className="flex justify-center gap-4">
          <button className="w-56 my-6 text-white bg-black border border-black rounded-3xl">
            Publish
          </button>

          <button
            onClick={() => {
              setIsDraft(true);
            }}
            className="w-56 my-6 border border-black rounded-3xl hover:bg-gray-200 "
          >
            Save As Draft
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBlog;
