// FavoriteRecipesPage.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import styled from 'styled-components';
import SmartRecipeChat from "../components/SmartRecipeChat";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const RecipesGrid = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    align-items: flex-start;
    padding: 1rem;

    @media (max-width: 800px) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
}

`;
const RecipeCard = styled.div`
    border: 1px solid #eee;
    border-radius: 12px;
    padding: 1rem;
    min-width: 280px;
    max-width: 350px;
    background: #fff0f5;
    margin-bottom: 1.5rem;
    box-shadow: 0 2px 8px rgba(236, 72, 153, 0.08);
    flex: 1 1 300px;
    display: flex;
    flex-direction: column;
`;

const FilterButton = styled.button`
    background: ${({ $active }) => $active ? "#ffb6c1" : "#f8f8f8"};
    color: ${({ $active }) => $active ? "white" : "#c94f7c"};
    border: none;
    padding: 7px 14px;
    margin-left: 0.5rem;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    margin-bottom: 10px;

    &:hover {
        background: #ffd1e3;
    }
`;

const ChatContainer = styled.div`

    display:flex;

`




function FavoriteRecipes() {
    const [recipes, setRecipes] = useState([]);
    const [filter, setFilter] = useState("הכל");
    const [filtered, setFiltered] = useState([]);

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!userId) {
            return;
        }

        axios
            .get(`${API_URL}/user/${userId}/favoriteRecipes`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                setRecipes(res.data);
                setFiltered(res.data);
            })
            .catch((err) => {
                console.error("שגיאה בטעינת מועדפים:", err);
            });
    }, [userId, token]);

    useEffect(() => {
        if (filter === "הכל") {
            setFiltered(recipes);
        } else {
            setFiltered(recipes.filter(r => r.tags.includes(filter)));
        }
    }, [filter, recipes]);

    const uniqueTags = Array.from(new Set(recipes.flatMap(r => r.tags))).filter(Boolean);

    const handleRemove = async (recipeId) => {
        try {
            await axios.delete(`${API_URL}/user/${userId}/favoriteRecipes/${recipeId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setRecipes(prev => prev.filter(r => r._id !== recipeId));
            setFiltered(prev => prev.filter(r => r._id !== recipeId));
        } catch (err) {
            console.error("שגיאה במחיקה:", err);
            alert("😢 לא ניתן היה להסיר את המתכון");
        }
    };


    return (
        <>
            <RecipesGrid>
                <h2>📌 המועדפים שלי</h2>

                <div style={{ marginBottom: "1rem" }}>
                    <FilterButton onClick={() => setFilter("הכל")} $active={filter === "הכל"}>הכל</FilterButton>
                    {uniqueTags.map((tag, i) => (
                        <FilterButton key={i} onClick={() => setFilter(tag)} $active={filter === tag}>
                            {tag}
                        </FilterButton>
                    ))}

                </div>

                {filtered.map((recipe, i) => (
                    <RecipeCard key={i}>
                        <h3>{recipe.title}</h3>

                        <p><strong>🛒 מרכיבים:</strong></p>
                        <ul>
                            {recipe.ingredients.map((item, idx) => <li key={idx}>{item}</li>)}
                        </ul>

                        <p><strong>👩‍🍳 הוראות:</strong></p>
                        <ul>
                            {recipe.instructions.map((step, idx) => <li key={idx}>{step}</li>)}
                        </ul>

                        <p><strong>🏷 תגיות:</strong> {recipe.tags.join(", ") || "ללא"}</p>
                        <button
                            onClick={() => handleRemove(recipe._id)}
                            style={{
                                background: "#ffcccc",
                                border: "none",
                                padding: "6px 10px",
                                borderRadius: "10px",
                                cursor: "pointer",
                                marginTop: "0.5rem"
                            }}
                        >
                            ❌ הסר ממועדפים
                        </button>

                    </RecipeCard>
                ))}
            </RecipesGrid>

            <ChatContainer>
                <SmartRecipeChat />
            </ChatContainer>
        </>
    );
}

export default FavoriteRecipes;