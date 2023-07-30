import React, { useState } from "react";
import "./post.scss";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Toast } from "@chakra-ui/react";
import FadeLoader from "react-spinners/FadeLoader";
import { CSSProperties } from "react";
import Update from "./update/Update";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Link } from "react-router-dom";

const fetchUser = async (id) => {
  try {
    const { data } = await axios.get(`http://localhost:3000/api/users/${id}`);
    console.log(data);
    return data;
  } catch (error) {
    throw Error("Unable to fetch user");
  }
};

const Post = () => {
  const { id } = useParams(); // Destructure the 'id' parameter from the returned object
  console.log(id);

  const [open, setClose] = useState(false);

  const { data, isLoading } = useQuery(["post", id], () => fetchUser(id), {
    onError: (error) => {
      Toast({ status: "error", title: error.message });
    },
  });

  return (
    <div className="post">
      <>
        {isLoading ? (
          <div>
            <FadeLoader
              color="black"
              loading={isLoading}
              cssOverride={{
                display: "block",
                margin: "0 auto",
                borderColor: "red",
              }}
              size={150}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        ) : (
          <>
            <div className="container">
              <div className="div-container">
                <Link to="/">
                  <div className="back-icon">
                    <KeyboardBackspaceIcon />
                  </div>
                </Link>
                <div className="container-0">
                  <div className="title">{data?.name}</div>
                  <div className="name">{data?.email}</div>
                  <div className="gender">{data?.gender}</div>
                  <div className="status">{data?.status}</div>
                </div>
                <div className="container-1">
                  <img src={data?.profilePic} alt="image" />
                </div>
              </div>
              <div className="Update-button">
                <button onClick={() => setClose(true)}>Update</button>
              </div>
            </div>
            {open && <Update setClose={setClose} id={data?._id} />}
          </>
        )}
      </>
    </div>
  );
};

export default Post;
