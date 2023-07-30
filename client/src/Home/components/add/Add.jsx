import React from "react";
import "./add.scss";
import { Button, position } from "@chakra-ui/react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { storage } from "../firebase/firebase";
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";

const Addpost = async ({ user }) => {
  try {
    const { data } = await axios.post(
      `http://localhost:3000/api/users/add/user`,
      user
    );
    return data;
  } catch (error) {
    throw new Error("Unable to add the user.");
  }
};

const Add = ({ setOpen }) => {
  const [loading, setLoading] = useState(false);
  const [img, setImg] = useState(null);
  const [uploaded, setUploaded] = useState(0);
  const [imageSelected, setImageSelected] = useState(false);
  const [imageUpload, setImageUpload] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    gender: "Gender",
    status: "true",
  });
  const toast = useToast();

  const { name, email, gender, profilePic, status } = user;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: type === "radio" ? checked : value,
    }));
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => {
      return axios.post("http://localhost:3000/api/users/add/user", {
        name,
        email,
        gender,
        status,
        profilePic,
      });
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast({
        status: "success",
        title: "Successfully added",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      setLoading(false);
      setOpen(false);
    },
    onError: () => {
      toast({
        status: "Error",
        title: "Error !",
        description: "Don't use the same email and name twice.",
        isClosable: true,
        duration: 5000,
      });
    },
  });

  const upload = (items) => {
    items.forEach((item) => {
      const fileName = new Date().getTime() + item.label + item.file.name;
      const uploadTask = storage.ref(`/items/${fileName}`).put(item.file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          setImageUpload(true);
        },
        (error) => {
          console.log(error);
          toast({
            position: "top-left",
            title: "Something went wrong",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
          setImageUpload(false);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((url) => {
            setUser((prev) => {
              return { ...prev, [item.label]: url };
            });
            setUploaded((prev) => prev + 1);
          });
        }
      );
    });
  };

  const handleImageUpload = (e) => {
    e.preventDefault();
    setImageUpload(true);
    upload([{ file: img, label: "profilePic" }]);
  };

  const handleSubmitWithImage = async (e) => {
    setLoading(true);
    try {
      e.preventDefault();
      mutation.mutate(name, email, gender, profilePic, status);
    } catch (err) {
      console.log(err);
    } finally {
      // setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    setImageSelected(true);
    setImg(e.target.files[0]);
  };

  console.log(user);

  return (
    <div className="Add-container">
      <div className="modal">
        <form onSubmit={(values) => console.log(values)}>
          <h1>Add New User</h1>
          <span onClick={() => setOpen(false)}>
            <CloseIcon />
          </span>
          <input
            type="text"
            placeholder="Name"
            name="name"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            placeholder="Email"
            name="email"
            onChange={handleChange}
            required
          />
          <div className="label-text-image">
            <div>Upload your avatar</div>
            <div>
              <label htmlFor="image">
                <AddToPhotosIcon />
              </label>
            </div>
          </div>
          <input
            type="file"
            id="image"
            name="profilePic"
            onChange={handleImageChange}
            className="hide"
            required
          />
          <select name="gender" onChange={handleChange}>
            <option>Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {uploaded ? (
            <>
              <Button
                isLoading={loading}
                loadingText="Submitting"
                colorScheme="teal"
                variant="outline"
                onClick={handleSubmitWithImage}
                className="button"
              >
                Submit
              </Button>
            </>
          ) : (
            <>
              {" "}
              <Button
                isLoading={imageUpload}
                loadingText="Uploading"
                colorScheme="teal"
                variant="outline"
                onClick={handleImageUpload}
                className="button"
              >
                Upload
              </Button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Add;
