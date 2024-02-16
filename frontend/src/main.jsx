import React, { Children } from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Register from "./pages/Register.jsx";
import { Provider } from "react-redux";
import store from "./store/store.js";
import Login from "./pages/Login.jsx";
import NewBlog from "./pages/NewBlog.jsx";
import Header from "./components/Header/Header.jsx";
import Layout from "./pages/Layout.jsx";
import Home from "./pages/Home.jsx";
import Blog from "./pages/Blog.jsx";
import Profile from "./pages/Profile.jsx";
import axios from "axios";
import EditBlog from "./pages/EditBlog.jsx";
import PrivateRoute from "./components/privateRoute.jsx";

// routes
const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/blog/:id",
        element: <Blog />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/blogs/new",
        element: (
          <PrivateRoute>
            <NewBlog />
          </PrivateRoute>
        ),
      },
      {
        path: "/blogs/edit/:id",
        element: (
          <PrivateRoute>
            <EditBlog />
          </PrivateRoute>
        ),
      },
      {
        path: "/profile/:id",
        element: <Profile />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
  // </React.StrictMode>
);
