import React, { useState } from "react";
import axios from "axios";

const User = () => {
  const [user, setUser] = useState({
    username: "",
    photo: "",
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handlePhoto = (e) => {
    setUser({ ...user, photo: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", user.username);
    formData.append("photo", user.photo);

    axios
      .post("http://localhost:3500/upload", formData)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="username"
        onChange={handleChange}
        value={user.username}
        required
      />
      <input type="file" name="photo" onChange={handlePhoto} required />
      <button>Submit</button>
    </form>
  );
};

export default User;
