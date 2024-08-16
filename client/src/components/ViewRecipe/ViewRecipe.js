import React, { useEffect, useState } from "react";
import "./ViewRecipe.css";

function ItemIngredients(props) {
  return <div className="item-container">{`● ${props.item}`}</div>;
}

function ViewRecipe(props) {
  const [ingredients, setIngredients] = useState([]);
  useEffect(() => {
    setIngredients(JSON.parse(props.objects.ingredients));
  }, []);
  return (
    <div
      className={`view-recipe-container ${props.isVisible ? "show" : "hide"}`}
    >
      <div className={`modal ${props.isVisible ? "show" : "hide"}`}>
        <h3>{props.objects.title}</h3>
        <hr />
        <img src={props.objects.path} className="img" alt="food" />
        <div style={{ width: "100%", marginBottom: 20 }}>
          <h3>Ingredients</h3>
        </div>
        <div className="ingredients-container">
          {ingredients.map((ingredient, index) => (
            <ItemIngredients key={index} item={ingredient.value} />
          ))}
        </div>
        <div style={{ width: "100%", marginBottom: 10, marginTop: 40 }}>
          <h3>Instruction</h3>
        </div>
        <div className="instruction-container">
          <p>{props.objects.instructions}</p>
        </div>
        <div className="controls-container">
          <button
            onClick={(e) => {
              props.onClick(false);
              document.body.style.overflow = "auto";
              props.setOpen(false);
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewRecipe;
