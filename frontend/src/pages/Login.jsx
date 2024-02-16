import React, { useRef } from "react";
import { useLoginMutation } from "../slices/usersApiSlice";
import { Button, Container, Form } from "react-bootstrap";
import { setUser } from "../slices/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  const [login, { error, isError, loading }] = useLoginMutation();

  const dispatch = useDispatch();

  const loginHandler = async (e) => {
    e.preventDefault();
    console.log("fsdfsdfsdf");
    const loginData = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };
    console.log(loginData);
    try {
      const res = await login(loginData).unwrap();
      console.log(res);
      dispatch(setUser(res));
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container className="py-2 max-w-[600px]">
      <h2 className="my-3">Login</h2>
      <Form onSubmit={loginHandler}>
        <Form.Group className="mb-2">
          <Form.Label> Email </Form.Label>
          <Form.Control
            defaultValue="mohamed@gmail.com"
            type="email"
            ref={emailRef}
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label> Password </Form.Label>
          <Form.Control defaultValue="123" type="text" ref={passwordRef} />
        </Form.Group>
        <Button type="submit" className="mt-3">
          Login
        </Button>
      </Form>
    </Container>
  );
};

export default Login;
