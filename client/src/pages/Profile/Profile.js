import React, { useEffect, useState } from "react";
import "./Profile.css";
import Recipecard from "../../components/RecipeCard/Recipecard";
import makeQuery from "../../services/makeRequest";
import { grid } from "ldrs";
grid.register();
function Profile() {
  const [foodlist, setFoodList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("post");
  async function userPost() {
    const result = await makeQuery(
      `${process.env.REACT_APP_PROXY}/user/post`,
      "POST",
      { userID: localStorage.getItem("USER_ID") },
      setLoading
    );
    setFoodList(result);
  }

  async function userFavorites() {
    const result = await makeQuery(
      `${process.env.REACT_APP_PROXY}/user/favorites`,
      "POST",
      { userID: localStorage.getItem("USER_ID") },
      setLoading
    );
    setFoodList(result);
  }

  useEffect(() => {
    userPost();
  }, []);
  function handleClick(e) {
    e.preventDefault();
    const dataname = e.target.getAttribute("data-name");
    setFoodList([]);
    switch (dataname) {
      case "post":
        e.target.classList.add("active");
        document.querySelector("#likepost").classList.remove("active");
        setActiveTab("post");
        userPost();
        break;
      case "likepost":
        e.target.classList.add("active");
        document.querySelector("#post").classList.remove("active");
        setActiveTab("likepost");
        userFavorites();
        break;
      default:
        alert("Invalid");
    }
  }

  return (
    <div className="profile-container">
      <div className="info-container">
        <img src="https://images.pexels.com/photos/262905/pexels-photo-262905.jpeg?auto=compress&cs=tinysrgb&w=600" />
        <br />
        <h3>Ed Emmanuel Perpetua</h3>
        <p>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry.{" "}
        </p>
      </div>
      <div className="foodlist-container">
        <div className="btn-container">
          <button
            type="button"
            className="tab-btn active"
            data-name="post"
            id="post"
            onClick={handleClick}
          >
            Posts
          </button>
          <button
            type="button"
            className="tab-btn"
            data-name="likepost"
            id="likepost"
            onClick={handleClick}
          >
            Liked Posts
          </button>
        </div>
        {loading && (
          <div className="loader">
            <l-grid size="120" speed="1.5" color="cyan"></l-grid>
          </div>
        )}
        <div className="itemList">
          {foodlist.map((item) => (
            <Recipecard
              key={item.id}
              Isprofile={true}
              objects={item}
              setOpen={setOpen}
              loadRecipe={(activeTab === "post" && userPost) || userFavorites}
            />
          ))}

          {/* {(loading && (
            <div className="loader">
              <l-grid size="120" speed="1.5" color="cyan"></l-grid>
            </div>
          )) ||
            foodlist.map((item) => (
              <Recipecard
                key={item.id}
                Isprofile={true}
                objects={item}
                setOpen={setOpen}
                loadRecipe={(activeTab === "post" && userPost) || userFavorites}
              />
            ))} */}
        </div>
      </div>
    </div>
  );
}

export default Profile;
