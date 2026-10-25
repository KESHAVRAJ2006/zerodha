import React from "react";

import Dashboard from "./Dashboard";
import TopBar from "./TopBar";

// the landing page sends us here as /?user=<name> after signup/login
const params = new URLSearchParams(window.location.search);
if (params.get("user")) {
  localStorage.setItem("username", params.get("user"));
  window.history.replaceState({}, "", window.location.pathname);
}

const Home = () => {
  return (
    <>
      <TopBar />
      <Dashboard />
    </>
  );
};

export default Home;
