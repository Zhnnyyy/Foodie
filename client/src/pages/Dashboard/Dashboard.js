import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import Navbar from "../../components/Navbar/Navbar";
import Recipecard from "../../components/RecipeCard/Recipecard";
import Post from "../../components/Posting/Post";
import makeQuery from "../../services/makeRequest";
import { useNavigate } from "react-router-dom";
import { grid } from "ldrs";
grid.register();
function Dashboard(props) {
  const [foodlist, setFoodlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (
      !localStorage.getItem("isLoggedIn") ||
      localStorage.getItem("isLoggedIn") === null
    ) {
      navigate("/");
    }
  }, []);

  const getFoodList = async () => {
    const result = await makeQuery(
      `${process.env.REACT_APP_PROXY}/recipe/list`,
      "POST",
      { userID: localStorage.getItem("USER_ID") },
      setLoading
    );

    setFoodlist(result);
  };
  useEffect(() => {
    setTimeout(() => {
      getFoodList();
    }, 1000);
  }, []);

  function shuffleFood(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
  }

  async function handleinput(e) {
    if (e.length === 0) {
      getFoodList();
      return;
    }

    try {
      await filteredDashboard(e);
    } catch (error) {
      console.log(error);
    }
  }

  async function filteredDashboard(e) {
    const result = await makeQuery(
      `${process.env.REACT_APP_PROXY}/recipe/search`,
      "POST",
      { search: e },
      setLoading
    );
    setFoodlist(result);
  }
  return (
    <div>
      <Navbar posted={getFoodList} searchInput={handleinput} />
      <div className="container" style={{ zIndex: isOpen ? 2 : 1 }}>
        {loading && (
          <div className="loader">
            <l-grid size="100" speed="1.5" color="cyan"></l-grid>
          </div>
        )}
        {foodlist.map((item) => (
          <Recipecard
            key={item.id}
            setOpen={setOpen}
            objects={item}
            loadRecipe={getFoodList}
          />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
