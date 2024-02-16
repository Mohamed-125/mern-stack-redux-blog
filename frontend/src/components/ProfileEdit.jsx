import React, { useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useEditUserMutation } from "../slices/usersApiSlice";
import axios from "axios";
import { setUser } from "../slices/authSlice";
import { useDispatch } from "react-redux";
import { useCreateCommentMutation } from "../slices/blogsApiSlice";

const ProfileEdit = ({ user, refetch }) => {
  const [profile, setProfile] = useState();
  const [profileUrl, setProfileUrl] = useState("");
  const [bio, setBio] = useState();
  const usernameRef = useRef();
  const emailRef = useRef();
  const currentPasswordRef = useRef();
  const newPasswordRef = useRef();
  const confirmPasswordRef = useRef();

  const [editUser, { isLoading, error }] = useEditUserMutation();

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
  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();

    const username = usernameRef.current.value;
    const email = emailRef.current.value;

    // const profileData =

    const res = await editUser({
      userId: user._id,
      data: {
        email,
        profileImg: profile ? await uploadToCloudinary(profile) : undefined,
        username,
        bio,
      },
    });
    dispatch(setUser(res.data));
    refetch();
    console.log(res);
  };
  return (
    <Form onSubmit={submitHandler}>
      <Form.Group>
        <Form.Label>Username</Form.Label>
        <Form.Control
          ref={usernameRef}
          className="mb-3"
          type="text"
          required
          defaultValue={user.username}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Email</Form.Label>
        <Form.Control
          ref={emailRef}
          className="mb-3"
          required
          type="email"
          defaultValue={user.email}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Bio</Form.Label>
        <Form.Control
          onChange={(e) => setBio(e.target.value)}
          as="textarea"
          className="mb-3 !min-h-[100px]"
          maxLength={180}
          type="text"
          defaultValue={user.bio}
        />
        <p> {bio?.length}/180 </p>
      </Form.Group>
      <Form.Group>
        <Form.Label>Profile Image</Form.Label>
        <Form.Control
          onChange={(e) => {
            setProfile(e.target.files[0]);
            setProfileUrl(URL.createObjectURL(e.target.files[0]));
          }}
          type="file"
          accept="image/*"
          className="mb-3 bg-gray-200"
        />
      </Form.Group>
      <Form.Group>
        <Form.Label> Current Password</Form.Label>
        <Form.Control ref={currentPasswordRef} className="mb-3" type="text" />

        <Form.Label> New Password</Form.Label>
        <Form.Control ref={newPasswordRef} className="mb-3" type="text" />

        <Form.Label> Confirm Password</Form.Label>
        <Form.Control ref={confirmPasswordRef} className="mb-4" type="text" />
      </Form.Group>
      <div className="flex justify-center">
        <Button className="mx-auto mb-7 min-w-[130px]" type="submit">
          Save
        </Button>
      </div>
    </Form>
  );
};

export default ProfileEdit;
