import { Button } from "@chakra-ui/react";
import React, { useState } from "react";
import { storage } from "../../Home/components/firebase/firebase";
import "./update.scss";
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";

const Update = ({ setClose, id }) => {
  //User useState
  const [user, setUser] = useState(null);

  //UseState for updatebutton
  const [updateButton, setUpdateButton] = useState(false);

  //ImageSelected useState
  const [imageSelected, setImageSelected] = useState(false);

  //Update useState
  const [updated, setUpdated] = useState(false);

  //Image useState
  const [img, setImg] = useState(null);

  //Image Upload Usestate
  const [imageUpload, setImageUpload] = useState(false);

  //using toast
  const toast = useToast();

  //React Querry
  const query = useQueryClient();

  //Query for update
  const mutation = useMutation({
    mutationFn: (id) => {
      return axios.put(`http://localhost:3000/api/users/${id}`, user);
    },
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["post"] });
      toast({
        status: "success",
        title: "Successfully updated",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      setUpdateButton(false);
      setClose(false);
    },
    onError: () => {
      toast({
        status: "error",
        title: "Something went wrong!",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    },
  });

  //upload fn with firestore
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
            setUpdated((prev) => prev + 1);
          });
        }
      );
    });
  };

  //handle Changething
  const handleChage = (e) => {
    e.preventDefault();
    const value = e.target.value;
    setUser({ ...user, [e.target.name]: value });
  };

  //handleImageChange
  const handleImageChange = (e) => {
    setImageSelected(true);
    setImg(e.target.files[0]);
  };

  //handle Upload
  const handleUpload = (e) => {
    e.preventDefault();
    setImageUpload(true);
    upload([{ file: img, label: "profilePic" }]);
  };

  //handleSubmit with image Upload
  const handleSubmitwithImage = (e) => {
    setUpdateButton(true);
    e.preventDefault();
    mutation.mutate(id);
  };

  //handleSubmit without image Upload
  const handleSubmitWithoutImage = (e) => {
    setUpdateButton(true);
    e.preventDefault();
    mutation.mutate(id);
  };

  console.log(user);
  console.log(img);

  return (
    <div className="update-container">
      <div className="item-container">
        <div className="title">Update your profile</div>
        <div className="close-icon" onClick={() => setClose(false)}>
          <CloseIcon />
        </div>
        <form action="">
          <input
            type="text"
            name="email"
            onChange={handleChage}
            placeholder="Email"
          />
          <input
            type="text"
            name="name"
            onChange={handleChage}
            placeholder="Name"
          />
          <div className="image-div">
            <div className="image-text">Change your avatar</div>
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
            className="hide"
            onChange={handleImageChange}
          />
          <select id="" name="gender" onChange={handleChage}>
            <option value="">Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          {imageSelected ? (
            <>
              {updated ? (
                <>
                  {" "}
                  <Button
                    isLoading={updateButton}
                    loadingText="Submitting"
                    colorScheme="teal"
                    variant="outline"
                    onClick={handleSubmitwithImage}
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
                    loadingText="Updating"
                    colorScheme="teal"
                    variant="outline"
                    onClick={handleUpload}
                    className="button"
                  >
                    Update
                  </Button>
                </>
              )}
            </>
          ) : (
            <>
              <Button
                isLoading={updateButton}
                loadingText="Uploading"
                colorScheme="teal"
                variant="outline"
                onClick={handleSubmitWithoutImage}
              >
                Submit
              </Button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Update;
