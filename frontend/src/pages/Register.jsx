import React, { useRef, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { useRegisterMutation } from "../slices/usersApiSlice";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const usernameRef = useRef();
  const [register, { error, isError, loading }] = useRegisterMutation();
  const [profile, setProfile] = useState({});
  const [profileUrl, setProfileUrl] = useState("");
  const [bio, setBio] = useState("");
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

  const dispatch = useDispatch();

  const registerHandler = async (e) => {
    e.preventDefault();
    const registerData = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
      profileImg: profileUrl
        ? await uploadToCloudinary(profile)
        : "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg",
      username: usernameRef.current.value,
      bio,
    };

    try {
      const res = await register(registerData).unwrap();
      console.log(res);
      dispatch(setUser(res));
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container className="py-2 max-w-[600px]">
      <h2 className="my-3">Regsiter</h2>
      <Form onSubmit={registerHandler}>
        <Form.Group className="mb-2">
          <Form.Label> Email </Form.Label>
          <Form.Control type="email" ref={emailRef} />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label> Username </Form.Label>
          <Form.Control type="text" ref={usernameRef} />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label> Profile Image </Form.Label>
          <Form.Control
            onChange={(e) => {
              setProfile(e.target.files[0]);
              setProfileUrl(URL.createObjectURL(e.target.files[0]));
            }}
            type="file"
            accept="image/*"
            className="bg-gray-200 "
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Bio</Form.Label>
          <Form.Control
            as="textarea"
            onChange={(e) => setBio(e.target.value)}
            className="mb-3 !min-h-[100px]"
            maxLength={180}
            type="text"
            required
          />
          <p> {bio?.length}/180 </p>
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label> Password </Form.Label>
          <Form.Control type="text" ref={passwordRef} />
        </Form.Group>
        <Button type="submit" className="mt-3">
          Register
        </Button>
      </Form>
    </Container>
  );
};

export default Register;
