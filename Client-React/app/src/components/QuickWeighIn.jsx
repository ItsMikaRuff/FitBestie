// QuickWeighIn.jsx

import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";

const Box = styled.div`
  direction: rtl;
  text-align: right;
  background: #fff;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.06);
  max-width: 480px;
  margin: 0 auto;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const Input = styled.input`
  padding: 0.6rem 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  width: 100%;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
`;

const Btn = styled.button`
  background-color: ${({ theme }) => theme.colors.secondary};
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 0.6rem 1rem;
  cursor: pointer;

  &:disabled { opacity: .6; cursor: not-allowed; }
`;

const LinkBtn = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.accent};
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
`;

function bmiCategory(bmi) {
    if (bmi < 18.5) return "תת משקל";
    if (bmi < 25) return "משקל תקין";
    if (bmi < 30) return "עודף משקל";
    if (bmi < 40) return "השמנה";
    return "השמנה חולנית";
}

export default function QuickWeighIn({ userId, defaultHeight, onSuccess }) {
    const [weight, setWeight] = useState("");
    const [height, setHeight] = useState(defaultHeight || "");
    const [editHeight, setEditHeight] = useState(!defaultHeight); // אם אין גובה – חובה להזין פעם ראשונה
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const w = parseFloat(weight);
        const h = parseFloat(height);

        if (!w || w <= 0) return setError("יש להזין משקל תקין.");
        if (!defaultHeight && (!h || h <= 0)) return setError("יש להזין גובה פעם אחת.");

        const cm = editHeight ? h : (defaultHeight || h);
        const meters = cm / 100;
        const bmi = Math.round((w / (meters * meters)) * 10) / 10;

        const payload = {
            userId,            // אם השרת שלך מצפה ל'user' במקום 'userId' — שני את המפתח
            weight: w,
            height: cm,
            bmi,
            bmiCategory: bmiCategory(bmi),
            date: new Date().toISOString(),
        };

        try {
            setSaving(true);
            const token = localStorage.getItem("token");
            await axios.post(
                `${process.env.REACT_APP_API_URL}/measurement`,
                payload,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                    timeout: 10000,
                }
            );
            onSuccess?.();
        } catch (err) {
            console.error("❌ שמירת שקילה נכשלה:", err);
            setError("שמירה נכשלה. נסי שוב.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Box>
            <h3>שקילה מהירה</h3>
            <form onSubmit={handleSubmit}>
                <Row>
                    <label>משקל (ק״ג)</label>
                    <Input
                        type="number"
                        inputMode="decimal"
                        step="0.1"
                        min="1"
                        placeholder="לדוגמה: 72.4"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        required
                    />
                </Row>

                {editHeight ? (
                    <Row>
                        <label>גובה (ס״מ)</label>
                        <Input
                            type="number"
                            inputMode="numeric"
                            step="0.1"
                            min="50"
                            max="260"
                            placeholder="לדוגמה: 175"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            required={!defaultHeight}
                        />
                    </Row>
                ) : (
                    <div style={{ fontSize: ".95rem", marginBottom: ".5rem" }}>
                        גובה קבוע: <strong>{defaultHeight} ס״מ</strong>{" "}
                        <LinkBtn type="button" onClick={() => setEditHeight(true)}>
                            שינוי גובה
                        </LinkBtn>
                    </div>
                )}

                {error && <div style={{ color: "crimson", marginBottom: ".5rem" }}>{error}</div>}

                <Actions>
                    <Btn type="submit" disabled={saving}>{saving ? "שומרת..." : "שמור שקילה"}</Btn>
                    <LinkBtn type="button" onClick={() => onSuccess?.()}>ביטול</LinkBtn>
                </Actions>
            </form>
        </Box>
    );
}
 