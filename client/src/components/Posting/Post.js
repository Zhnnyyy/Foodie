import React, { useEffect, useState } from "react";
import "../../assets/style/variable.css";
import "./Post.css";
import IngredientsList from "../IngredientsList/IngredientsList";
import { ring } from "ldrs";
ring.register();
function Post(props) {
  const [ingredients, setIngredients] = useState([{ id: 1, value: "" }]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [frmdata, setFrmdata] = useState({
    name: "",
    instruction: "",
    photo: "",
    file: null,
  });
  const [error, setError] = useState({});
  function handleClose() {
    props.onClose(false);
  }

  useEffect(() => {
    setFrmdata({
      name: "",
      instruction: "",
      photo: "",
      file: null,
    });
    document.getElementById("file-input").value = null;
    setIngredients([]);
    setIngredients([{ id: 1, value: "" }]);
  }, [props.isVisible]);

  function addIngredients() {
    setIngredients([
      ...ingredients,
      { id: ingredients[ingredients.length - 1].id + 1, value: "" },
    ]);
  }

  function removeItem(e) {
    setIngredients(ingredients.filter((item) => item.id !== e));
  }

  function IngredientsValue(id, newvalue) {
    setIngredients(
      ingredients.map((item) =>
        item.id === id ? { ...item, value: newvalue } : item
      )
    );
  }

  function handleFile(e) {
    setFile(e.target.files[0]);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFrmdata((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function validateIngredients() {
    return ingredients.some((item) => item.value.trim() === "");
  }

  function validation(frm) {
    let err = {};
    if (!frm.name) {
      err.name = "Food name is required";
    }
    if (!frm.instruction) {
      err.instruction = "Instruction is required";
    }
    if (ingredients.length === 0 || validateIngredients()) {
      err.ingredients = "Ingredients is required";
    }
    if (!frm.file) {
      err.file = "File is required";
    }
    return err;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const errors = validation(frmdata);
    if (file) {
      delete errors.file;
    }
    if (Object.keys(errors).length > 0) {
      setError(errors);
      return;
    }
    const formData = new FormData();
    formData.append("name", frmdata.name);
    formData.append("instructions", frmdata.instruction);
    formData.append("ingredients", JSON.stringify(ingredients));
    formData.append("file", file);
    formData.append("userID", localStorage.getItem("USER_ID"));
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_PROXY}/recipe/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) {
        setLoading(false);
        return new Error("failed to post");
      }
      const result = await response.json();
      setLoading(false);
      props.posting();
      if (!result.Error) {
        props.onClose(false);
      } else {
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  }

  return (
    <div className={`post-container ${props.isVisible ? "show" : "hide"}`}>
      <div className={`modal ${props.isVisible ? "show" : "hide"}`}>
        <h2>Add a New Recipe</h2>
        <p>Share your favorite recipe with the community.</p>
        <br />
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Food Name</label>
            <input
              type="text"
              name="name"
              onChange={handleChange}
              value={frmdata.name}
            />
            {error.name && <span className="error">{error.name}</span>}
          </div>
          <div className="form-group">
            <label>Ingredients</label>
            <div className="ingredients-container">
              {ingredients.map((item, i) => (
                <IngredientsList
                  key={i}
                  id={item.id}
                  length={ingredients.length}
                  onRemove={removeItem}
                  onChange={IngredientsValue}
                  value={item.value}
                />
              ))}
            </div>
            {validateIngredients() && (
              <span className="error">{error.ingredients}</span>
            )}
            <button type="button" onClick={addIngredients}>
              Add Ingredients
            </button>
          </div>
          <div className="form-group">
            <label>Instructions</label>
            <textarea
              placeholder="Describe the steps to prepare the recipe"
              name="instruction"
              onChange={handleChange}
              value={frmdata.instruction}
            />
            {error.instruction && (
              <span className="error">{error.instruction}</span>
            )}
          </div>
          <div className="form-group">
            <label>{`Image`}</label>
            <input
              type="file"
              onChange={handleFile}
              name="file"
              id="file-input"
            />
            {error.file && <span className="error">{error.file}</span>}
          </div>
          <div className="form-controls">
            <button type="button" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit">
              {loading ? (
                <l-ring
                  size="30"
                  stroke="2"
                  bg-opacity="0"
                  speed="2"
                  color="#fff"
                ></l-ring>
              ) : (
                "Post"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Post;
