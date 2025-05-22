// FavoriteRecipesPage.jsx

import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

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
        <div style={{ padding: "2rem" }}>
            <h2>📌 המועדפים שלי</h2>

            <div style={{ marginBottom: "1rem" }}>
                <button onClick={() => setFilter("הכל")}>הכל</button>
                {uniqueTags.map((tag, i) => (
                    <button key={i} onClick={() => setFilter(tag)} style={{ marginLeft: "0.5rem" }}>
                        {tag}
                    </button>
                ))}
            </div>

            {filtered.map((recipe, i) => (
                <div
                    key={i}
                    style={{
                        border: "1px solid #eee",
                        borderRadius: "12px",
                        padding: "1rem",
                        marginBottom: "1.5rem",
                        background: "#fff0f5"
                    }}
                >
                    <h3>{recipe.title}</h3>

                    <p><strong>🛒 מרכיבים:</strong></p>
                    <ul>
                        {recipe.ingredients.map((item, idx) => <li key={idx}>{item}</li>)}
                    </ul>

                    <p><strong>👩‍🍳 הוראות:</strong></p>
                    <ol>
                        {recipe.instructions.map((step, idx) => <li key={idx}>{step}</li>)}
                    </ol>

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

                </div>
            ))}
        </div>
    );
}

export default FavoriteRecipes;