import React, { useState } from "react";
import "../../assets/style/variable.css";
import "./Navbar.css";
import { IoIosSearch } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import { IoPersonOutline } from "react-icons/io5";
import ProfileDropdown from "../ProfileSelection/ProfileDropdown";
import Post from "../../components/Posting/Post";
function Navbar(props) {
  const [isVisible, setVisible] = useState(false);
  const [post, setPost] = useState(false);

  const handleProfileClick = () => {
    setVisible(!isVisible);
  };

  const handlePostClick = () => {
    setPost(true);
  };

  function handleInputChange(e) {
    props.searchInput(e.target.value);
  }
  return (
    <div className="navbar-container">
      <Post isVisible={post} onClose={setPost} posting={props.posted} />
      <ProfileDropdown isVisible={isVisible} />
      <h3 className="title">Foodie Recipes</h3>
      <div className="input-container">
        <IoIosSearch className="searchIcon" />
        <input type="text" placeholder="Search" onChange={handleInputChange} />
      </div>
      <div className="control-container">
        <button className="navButton" onClick={handlePostClick}>
          <FaPlus className="post-icon" />
        </button>
        <button className="navButton" onClick={handleProfileClick}>
          <IoPersonOutline className="profile-icon" />
        </button>
      </div>
    </div>
  );
}

export default Navbar;
