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
import { useNavigate } from "react-router-dom";
import { useCreateBlogMutation } from "../slices/blogsApiSlice";

const NewBlog = () => {
  const [editorValue, setEditorValue] = useState([]);
  const [img, setImg] = useState();
  const [title, setTitle] = useState("");
  const [bannerImg, setBannerImg] = useState({});
  const [bannerImgUrl, setBannerImgUrl] = useState("");
  const [publishModel, setPublishModel] = useState(false);
  const [description, setDescription] = useState("");
  const [editorError, setEditorError] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [rendered, setRendered] = useState(false);

  const navigate = useNavigate();
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    console.log("file", file);
    formData.append("file", file);
    formData.append("upload_preset", "duwpl68m");
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dwznxzijq/image/upload",
      formData,
      {
        withCredentials: false,
      }
    );

    const url = res.data.url;

    return url;
  };

  const uploadImgByURL = (e) => {
    console.log(e);
    const link = new Promise((resolve, reject) => {
      try {
        resolve(e);
      } catch (err) {
        reject(err);
      }
    });

    return link.then((url) => {
      return { success: 1, file: { url } };
    });
  };

  const uploadImgByFile = async (e) => {
    const url = await uploadToCloudinary(e);
    const link = new Promise((resolve, reject) => {
      resolve(url);
    });

    return link.then((url) => {
      console.log(url, e);
      if (url) {
        return {
          success: 1,
          file: { url },
        };
      }
    });
  };

  useEffect(() => {
    // if (rendered) {
    new EditorJS({
      /**
       * Id of Element that should contain the Editor
       */
      holder: "editorjs",

      /**
       * Available Tools list.
       * Pass Tool's class or Settings object for each Tool you want to use
       */
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
        console.log(content);
        setEditorValue(content);
      },
    });
    // }
    // return () => {
    //   setRendered(true);
    // };
  }, []);

  const [createBlog, { isLoading, error }] = useCreateBlogMutation();

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
      const url = await uploadToCloudinary(bannerImg);
      console.log(url);
      console.log(editorValue);

      const blogData = isDraft
        ? {
            title,
            bannerImg: url,
            data: editorValue,
            description,
            isDraft: true,
          }
        : {
            title,
            bannerImg: url,
            data: editorValue,
            description,
            isDraft: false,
          };
      const res = await createBlog(blogData);
      console.log(res);
    }
  };

  return (
    <div className="container">
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
                      setTitle(e.target.value.trim());
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
                        setDescription(e.target.value.trim());
                      }}
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
            required
            type="file"
            accept="image/*"
            className="mt-1 !py-8 bg-gray-200"
          />
        </div>

        <div className="flex flex-col w-full gap-3 mb-8">
          <h2> Blog Title</h2>

          <input
            onChange={(e) => {
              setTitle(e.target.value.trim());
            }}
            type="text"
            className="mb-5 border-t-0 border-b-2 border-l-0 border-r-0 border-gray-300 rounded-none focus-visible:outline-none"
            placeholder="Blog Title"
            required
            name="Blog Title"
          />
        </div>

        <h2>Type Your Blog </h2>
        <div id="editorjs" className="py-5 mt-4 lg:mx-6 sm:mx-0"></div>
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

export default NewBlog;
