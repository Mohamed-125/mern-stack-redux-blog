import React, { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import {
  useEditUserMutation,
  useGetUserQuery,
  useUnFollowMutation,
} from "../slices/usersApiSlice";
import { Container } from "react-bootstrap";
import Loader from "../components/Loader.jsx";
import PublishedBlogs from "../components/PublishedBlogs";
import DraftBlogs from "../components/DraftBlogs";
import ProfileEdit from "../components/ProfileEdit";
import Notifications from "../components/Notifications";
import { useSelector } from "react-redux";

const Profile = () => {
  const id = useParams().id;
  const { data, isLoading, error, refetch } = useGetUserQuery(id);
  const navigate = useNavigate();
  const [activeSelect, setActiveSelect] = useState(1);
  const user = useSelector((state) => state.auth.user);
  const [followers, setFollowers] = useState([]);
  const [editUser, {}] = useEditUserMutation();
  const [unfollow, {}] = useUnFollowMutation();
  const [notifications, setNotifications] = useState(0);

  const isFollowing = useMemo(() => {
    return followers.includes(user?._id);
  }, [followers]);

  useEffect(() => {
    console.log(data);
    const length = data?.notifications.length;
    if (!isNaN(length)) {
      const newLength = +length - +localStorage.getItem("notifications");
      setNotifications(newLength);
      console.log(newLength, +localStorage.getItem("notifications"));
    }
    localStorage.setItem("notifications", data?.notifications.length || 0);
    setFollowers(data?.followers || []);
  }, [data]);

  if (isLoading) return <Loader />;
  if (error?.originalStatus === 404) navigate("/404", { replace: true });

  const isSameUser = user?._id === id;

  const publishedBlogs = data?.blogs?.filter((blog) => !blog.isDraft);

  const draftBlogs = data?.blogs?.filter((blog) => blog.isDraft);

  const selectActive = (e, number) => {
    document
      .querySelectorAll(".select-btn")
      .forEach((btn) => btn.classList.remove("active-select"));
    e.target.classList.add("active-select");
    setActiveSelect(number);
  };

  const followHandler = async () => {
    const res = await editUser({
      userId: id,
      data: { follower: user._id },
    }).unwrap();
    setFollowers((pre) => [...pre, user._id]);
  };

  const unFollowHandler = async () => {
    const res = await unfollow({
      userId: id,
      data: { follower: user._id, operation: "unfollow" },
    }).unwrap();
    setFollowers((pre) => pre.filter((follower) => follower !== user._id));
  };

  console.log(isFollowing);
  return (
    <Container>
      <div className="flex justify-center ">
        <img
          src={data.profileImg}
          className="rounded-full w-[150px] h-[150px]"
        />
      </div>
      <h2 className="mt-2.5 text-center">{data.username}</h2>
      <p className="mt-0 text-center text-gray-500">{data.email}</p>
      <p className="mt-0 text-center ">
        {data.bio ? data.bio : "There's no bio for this user"}
      </p>

      {!isSameUser && user?._id ? (
        isFollowing ? (
          <button
            onClick={unFollowHandler}
            className="block px-4 py-2 mx-auto mb-4 text-white bg-black rounded-md"
          >
            Unfollow
          </button>
        ) : (
          <button
            onClick={followHandler}
            className="block px-4 py-2 mx-auto mb-4 text-white bg-black rounded-md"
          >
            Follow
          </button>
        )
      ) : null}

      {/* select div */}
      {isSameUser ? (
        <>
          <div className="flex justify-center gap-3 mb-4">
            <button
              className="flex items-center px-3 py-1 text-center rounded-md select-btn active-select bg-stone-200 "
              onClick={(e) => {
                selectActive(e, 1);
              }}
            >
              Published Blogs
            </button>
            <button
              onClick={(e) => {
                selectActive(e, 2);
              }}
              className="flex items-center px-3 py-1 text-center rounded-md select-btn bg-stone-200 "
            >
              Draft Blogs
            </button>
            <button
              onClick={(e) => {
                selectActive(e, 3);
              }}
              className="flex items-center px-3 py-1 text-center rounded-md select-btn bg-stone-200 "
            >
              Notifications {notifications}
            </button>
            <button
              onClick={(e) => {
                selectActive(e, 4);
              }}
              className="flex items-center px-3 py-1 text-center rounded-md select-btn bg-stone-200 "
            >
              Edit Profile
            </button>
          </div>
          {activeSelect === 1 ? (
            <PublishedBlogs
              publishedBlogs={publishedBlogs ? publishedBlogs : []}
            />
          ) : activeSelect === 2 ? (
            <DraftBlogs draftBlogs={draftBlogs ? draftBlogs : []} />
          ) : activeSelect === 3 ? (
            <Notifications user={data} />
          ) : activeSelect === 4 ? (
            <ProfileEdit user={data} refetch={refetch} />
          ) : null}
        </>
      ) : (
        <PublishedBlogs publishedBlogs={publishedBlogs} />
      )}
    </Container>
  );
};

export default Profile;
