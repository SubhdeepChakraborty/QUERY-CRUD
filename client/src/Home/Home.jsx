import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import "./home.scss";
import FadeLoader from "react-spinners/FadeLoader";
import { CSSProperties } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import Add from "./components/add/Add";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";

const fetchData = async () => {
  try {
    const data = await axios.get("http://localhost:3000/api/users/");
    console.log(data);
    return data;
  } catch (error) {
    throw Error("Unable to fetch posts");
  }
};

const Home = () => {
  const toast = useToast();
  const { data, isLoading, error } = useQuery(["posts"], fetchData, {
    onError: () => {
      toast({
        position: "top-left",
        title: "Error",
        description: "Something went wrong!",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    },
  });

  console.log(data);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const handleClick = (e) => {
    e.preventDefault();
    setOpen(true);
    toast({
      position: "top-left",
      title: "Create Account.",
      description: "Please fill up the details !",
      status: "info",
      duration: 4000,
      isClosable: true,
    });
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id) => {
      return axios.delete(`http://localhost:3000/api/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast({
        status: "success",
        title: "Success",
        duration: 1000,
        isClosable: true,
        position: "top",
      });
    },
    onError: () => {
      toast({
        status: "error",
        title: "Something went wrong",
        duration: 3000,
        position: "top-left",
        isClosable: true,
      });
    },
  });

  const handleDelete = (id) => {
    mutation.mutate(id);
  };

  return (
    <div className="home">
      <>
        {isLoading ? (
          <div className="title-div">
            {/* <h1 className="title-loading"></h1> */}
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
          <div>
            <div className="Add-button">
              <button onClick={handleClick}>Add New Post</button>
            </div>
            <div className="container">
              {data?.data?.map((item) => (
                <div key={item?._id}>
                  <span
                    onClick={() => handleDelete(item?._id)}
                    className="Close"
                  >
                    <PersonRemoveIcon />{" "}
                  </span>
                  <Link to={`/${item?._id}`}>
                    <div className="box">
                      <div className="item">
                        <div className="id">{item?._id}</div>
                        <div className="name">{item?.name}</div>
                        <div className="email">{item?.email}</div>
                        <div className="gender">{item?.gender}</div>
                      </div>
                      <div className="item-1">
                        <img
                          src={item?.profilePic}
                          alt="image"
                          className="image"
                        />
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
            {open && <Add setOpen={setOpen} />}
          </div>
        )}
      </>
    </div>
  );
};

export default Home;
