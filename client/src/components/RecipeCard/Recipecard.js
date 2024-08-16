import React, { useEffect, useState } from "react";
import "./Recipecard.css";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import ViewRecipe from "../../components/ViewRecipe/ViewRecipe";
import makeQuery from "../../services/makeRequest";
import { MdEdit } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
function Recipecard(props) {
  const [showRecipe, setShowRecipe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isProfile, setIsProfile] = useState(props.Isprofile || false);

  async function handleClick() {
    const result = await makeQuery(
      `${process.env.REACT_APP_PROXY}/recipe/like`,
      "POST",
      { userID: localStorage.getItem("USER_ID"), recipe_id: props.objects.id },
      setLoading
    );
    if (result) {
      props.loadRecipe();
    }
  }
  return (
    <>
      <ViewRecipe
        isVisible={showRecipe}
        onClick={setShowRecipe}
        setOpen={props.setOpen}
        objects={props.objects}
      />
      <div className="recipecard-container">
        <div
          className="img-container"
          style={{ backgroundImage: `url(${props.objects.path})` }}
        ></div>
        {isProfile && (
          <div className="backdrop-container">
            <div className="btn">
              <MdEdit className="edit-pen" />
            </div>
            <div className="btn">
              <MdDeleteOutline className="delete-trash" />
            </div>
          </div>
        )}
        <div className="recipe-info">
          <div className="info">
            <h3>{props.objects.title}</h3>
          </div>
          <div className="recipe-control">
            <button
              onClick={(e) => {
                props.setOpen(true);
                document.body.style.overflow = "hidden";
                setShowRecipe(true);
              }}
            >
              View Recipe
            </button>
            <div className="fave-btn-con" onClick={handleClick}>
              {props.objects.like === "1" ? (
                <FaHeart className="favorite-btn liked" />
              ) : (
                <FaRegHeart className="favorite-btn" />
              )}
              <span>{props.objects.likes}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Recipecard;
