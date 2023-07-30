import React from "react";
import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import { Heading } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import Home from "./Home/Home";
import Marquee from "react-fast-marquee";
import Post from "./post/post";

const App = () => {
  return (
    <div className="main">
      <Marquee>
        <div className="header">
          -- React Query -- React Query -- React Query -- React Query -- React
          Query -- React Query --
        </div>
      </Marquee>
      <Routes>
        <Route path="/">
          <Route index element={<Home />} />
          <Route path=":id" element={<Post />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
