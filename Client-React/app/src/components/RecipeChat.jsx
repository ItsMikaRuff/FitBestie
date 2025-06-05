// SmartRecipeChat.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { FaRobot, FaTimes } from "react-icons/fa";
import TypingIndicator from "./TypingIndicator";
import styled from "styled-components";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const ChatWrapper = styled.div`
  position: fixed;
  bottom: 100px;
  right: ${({ sidebarOpen }) => (sidebarOpen ? "260px" : "20px")};
  width: 320px;
  max-height: 500px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  transition: right 0.3s;
`;


const ChatHeader = styled.div`
  background: #ffb6c1;
  padding: 12px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
`;

const ChatBody = styled.div`
  flex: 1;
  padding: 12px;
  overflow-y: auto;
  background: #fffdfd;
`;

const ChatFooter = styled.div`
  display: flex;
  padding: 8px;
  border-top: 1px solid #ddd;
`;

const Input = styled.input`
  flex: 1;
  padding: 8px;
  border-radius: 12px;
  border: 1px solid #ccc;
`;

const SendButton = styled.button`
  margin-left: 8px;
  background: #ffb6c1;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
`;

const FloatingButton = styled.button`
  position: fixed;
  bottom: 32px;
   right: ${({ sidebarOpen }) => (sidebarOpen ? "260px" : "32px")};
  z-index: 2000;
  background: #ffb6c1;
  border: none;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  color: white;
  font-size: 24px;
  cursor: pointer;

  @media (max-width: 600px) {
  right: 16px;
   right: ${({ sidebarOpen }) => (sidebarOpen ? "260px" : "32px")};
}

`;

export default function SmartRecipeChat({sidebarOpen}) {

    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [savedTitles, setSavedTitles] = useState([]);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([
                {
                    from: "bot",
                    text: "👋 שלום! כתבי לי מה יש לך במקרר או במזווה, ואציע לך מתכונים – לדוגמה: עגבנייה, ביצה, טונה 🍅🥚🐟"
                }
            ]);
        }
    }, [isOpen, messages]);

    const toggleChat = () => setIsOpen(!isOpen);

    const handleSend = async () => {
        const userMessage = input.trim();
        if (!userMessage) return;

        setInput("");

        if (userMessage.length < 2 || !/[\u0590-\u05FF]/.test(userMessage)) {
            setMessages(prev => [
                ...prev,
                { from: "user", text: userMessage },
                { from: "bot", text: "🤖 אני צריכה שתכתבי לי רשימה של מצרכים. לדוגמה: עגבנייה, טונה, ביצה 🍅🐟🥚" }
            ]);
            return;
        }

        setMessages(prev => [
            ...prev,
            { from: "user", text: userMessage },
            { from: "bot", text: "__typing__" }
        ]);

        try {
            const res = await axios.post(`${API_URL}/recipes/generate`, {
                ingredients: userMessage.split(",").map(i => i.trim()),
            });

            const parsed = parseRecipesFromGPT(res.data.recipes);
            setMessages(prev => [
                ...prev.slice(0, -1),
                ...parsed.map(p => ({ from: "bot", text: p.raw, recipe: p }))
            ]);
        } catch {
            setMessages(prev => [
                ...prev.slice(0, -1),
                { from: "bot", text: "אירעה שגיאה 😢" }
            ]);
        }
    };

    function formatBotMessage(text) {
        const lines = text.split("\n").filter(line => line.trim() !== "");
        return lines.map(line => {
            if (line.startsWith("###")) return `<h4 style='color:#d63384'>${line.replace("###", "").trim()}</h4>`;
            if (line.startsWith("**מרכיבים:**")) return `<strong>🛒 מרכיבים:</strong>`;
            if (line.startsWith("**הוראות הכנה:**")) return `<strong>👩‍🍳 הוראות הכנה:</strong>`;
            if (line.startsWith("- ")) return `<li>${line.slice(2)}</li>`;
            if (/^\d+\./.test(line)) return `<p>${line}</p>`;
            return `<p>${line}</p>`;
        }).join("");
    }

    function parseRecipesFromGPT(text) {
        const chunks = text.split("---").map(c => c.trim()).filter(Boolean);
        return chunks.map(chunk => {
            const title = chunk.match(/### שם המתכון: (.+)/)?.[1]?.trim() || "ללא שם";
            const ingredients = chunk.match(/מרכיבים:\n([\s\S]*?)\n(?:הוראות|הוראות הכנה)/)?.[1]?.split("\n").map(i => i.replace(/^[-•]\s*/, "")) || [];
            const instructions = chunk.match(/הוראות(?: הכנה)?:\n([\s\S]*?)(?:\nתגיות|\n$)/)?.[1]?.split("\n").map(i => i.trim()) || [];
            const tags = chunk.match(/תגיות.*?:\s*(.+)/)?.[1]?.split(",").map(t => t.trim()) || [];
            return { title, ingredients, instructions, tags, raw: chunk };
        });
    }

    const handleSaveFavorite = async (recipe) => {
        if (!recipe || !recipe.title || recipe.title === "ללא שם" || savedTitles.includes(recipe.title)) return;
        try {
            const token = localStorage.getItem("token");
            const userId = localStorage.getItem("userId");

            await axios.post(`${API_URL}/user/${userId}/favoriteRecipes`, recipe, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSavedTitles(prev => [...prev, recipe.title]);
            console.log(`✨ המתכון "${recipe.title}" נשמר למועדפים!`);
        } catch (err) {
            console.error("שגיאה בשמירה:", err);
            alert("😢 שגיאה בשמירה למועדפים");
        }
    };

    return (
        <>
            <FloatingButton sidebarOpen={sidebarOpen}  onClick={toggleChat}>
                {isOpen ? <FaTimes /> : <FaRobot />}
            </FloatingButton>

            {isOpen && (
                <ChatWrapper sidebarOpen={sidebarOpen}>
                    <ChatHeader>
                        מתכונים לפי מה שיש בבית 🍳
                        <FaTimes style={{ cursor: "pointer" }} onClick={toggleChat} />
                    </ChatHeader>

                    <ChatBody>
                        {messages.map((msg, i) => (
                            <div key={i} dir="rtl" style={{ marginBottom: "12px", textAlign: msg.from === "user" ? "right" : "left" }}>
                                <div style={{ display: "inline-block", background: msg.from === "user" ? "#ffe4e1" : "#f0f0f0", padding: "8px 12px", borderRadius: "12px", maxWidth: "90%" }}>
                                    {msg.text === "__typing__" ? (
                                        <TypingIndicator />
                                    ) : msg.from === "bot" && msg.recipe ? (
                                        <div>
                                            <div dangerouslySetInnerHTML={{ __html: formatBotMessage(msg.recipe.raw) }} />
                                            {savedTitles.includes(msg.recipe.title) ? (
                                                <div style={{ marginTop: "8px", color: "green", fontWeight: "bold" }}>✅ נשמר למועדפים</div>
                                            ) : (
                                                <button
                                                    onClick={() => handleSaveFavorite(msg.recipe)}
                                                    style={{ marginTop: "8px", background: "#ff69b4", color: "white", border: "none", borderRadius: "12px", padding: "6px 12px", cursor: "pointer" }}
                                                >
                                                    ❤️ שמור למועדפים
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <div>{msg.text}</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </ChatBody>

                    <ChatFooter>
                        <Input
                            placeholder="מה יש לך בבית?"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        />
                        <SendButton onClick={handleSend}>שלחי</SendButton>
                    </ChatFooter>
                </ChatWrapper>
            )}
        </>
    );
}