import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const QuizContainer = styled.div`
    max-width: 800px;
    margin: 0 auto;
    font-family: 'Arial', sans-serif;
    direction: rtl;
`;

const QuestionBlock = styled.div`
    background-color: #f7f7f7;
    border-radius: 16px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
`;

const QuestionTitle = styled.h3`
    margin-bottom: 1rem;
    color: #333;
`;

const Option = styled.label`
    display: block;
    margin-bottom: 0.75rem;
    font-size: 1rem;
    color: #555;

    input {
        margin-right: 0.5rem;
    }
`;

const SubmitButton = styled.button`
    background-color: #6c5ce7;
    color: white;
    padding: 0.6rem 1.2rem;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    margin-top: 1rem;

    &:hover {
        background-color: #5a4bcf;
    }
`;

const StyledLink = styled(Link)`
    display: inline-block;
    margin-top: 1.5rem;
    color: #6c5ce7;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
`;



const PersonalQuiz = () => {


    const [answers, setAnswers] = useState({
        goal: "",
        activity: "",
        bodyType: "",
    });

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return <p>Unauthorized</p>; // Check if user is logged in


    const handleChange = (e) => {
        setAnswers({ ...answers, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        console.log("תשובות:", answers);
        try {
            const response = await fetch("http://localhost:5000/quiz/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: user?._id,
                    answers,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                alert("התשובות נשמרו בהצלחה 🎉");
            } else {
                alert("שגיאה: " + data.message);
            }
        } catch (error) {
            console.error("Error saving quiz:", error);
            alert("שגיאה בשמירת השאלון");
        }
    };

    return (
        <QuizContainer>
            <h1>📝 שאלון התאמה אישית</h1>
            <QuestionBlock>
                <QuestionTitle>🎯 מהו היעד האישי שלך?</QuestionTitle>
                <Option>
                    <input
                        type="radio"
                        name="goal"
                        value="חיטוב"
                        onChange={handleChange}
                    />
                    חיטוב הגוף
                </Option>
                <Option>
                    <input
                        type="radio"
                        name="goal"
                        value="עלייה במסת שריר"
                        onChange={handleChange}
                    />
                    עלייה במסת שריר
                </Option>
                <Option>
                    <input
                        type="radio"
                        name="goal"
                        value="שמירה על הכושר"
                        onChange={handleChange}
                    />
                    שמירה כללית על כושר ובריאות
                </Option>
            </QuestionBlock>

            <QuestionBlock>
                <QuestionTitle>🏃‍♀️ כמה פעמים בשבוע את מתאמנת?</QuestionTitle>
                <Option>
                    <input
                        type="radio"
                        name="activity"
                        value="0-1"
                        onChange={handleChange}
                    />
                    0-1 פעמים
                </Option>
                <Option>
                    <input
                        type="radio"
                        name="activity"
                        value="2-3"
                        onChange={handleChange}
                    />
                    2-3 פעמים
                </Option>
                <Option>
                    <input
                        type="radio"
                        name="activity"
                        value="4 ומעלה"
                        onChange={handleChange}
                    />
                    4 ומעלה
                </Option>
            </QuestionBlock>

            <QuestionBlock>
                <QuestionTitle>🧬 מהו מבנה הגוף שלך?</QuestionTitle>
                <Option>
                    <input
                        type="radio"
                        name="bodyType"
                        value="אקטומורף"
                        onChange={handleChange}
                    />
                    אקטומורף (רזה, מתקשה לעלות מסת שריר)
                </Option>
                <Option>
                    <input
                        type="radio"
                        name="bodyType"
                        value="מזומורף"
                        onChange={handleChange}
                    />
                    מזומורף (מבנה ביניים, שרירי יחסית)
                </Option>
                <Option>
                    <input
                        type="radio"
                        name="bodyType"
                        value="אנדומורף"
                        onChange={handleChange}
                    />
                    אנדומורף (נטייה לעלות במשקל בקלות)
                </Option>
            </QuestionBlock>

            <SubmitButton onClick={handleSubmit}>שמור תשובות</SubmitButton>
            <StyledLink to="/profile">← חזרה לפרופיל</StyledLink>
        </QuizContainer>
    );
};

export default PersonalQuiz;
