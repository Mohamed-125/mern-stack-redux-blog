import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";

const Layout = () => {
  return (
    <div>
      <Header
        logo="Logo"
        linkColor="black"
        hoverColor="#1f75ff"
        backgroundColor="white"
      ></Header>
      <Outlet />
    </div>
  );
};

export default Layout;
