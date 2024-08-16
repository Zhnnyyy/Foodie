import React from "react";
import "./IngredientsList.css";
import { FiTrash } from "react-icons/fi";
function IngredientsList(props) {
  function handclick() {
    if (props.length === 1) {
      return;
    }
    props.onRemove(props.id);
  }

  return (
    <div className="ingredientsList-container">
      <input
        type="text"
        onChange={(e) => props.onChange(props.id, e.target.value)}
        value={props.value}
      />
      <button type="button" className="removeItem" onClick={handclick}>
        <FiTrash />
      </button>
    </div>
  );
}

export default IngredientsList;
