import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import styled from "styled-components";
import Loader from "../components/Loader";
import {
  LoginInput,
  LoginButton,
  GlobalError,
} from "../components/styledComponents";

// כאן אפשר לשים HEX שלך במקום #ffe7ef
const BgWrapper = styled.div`
  min-height: 100vh;
  background-color: #f8eaef;
  display: flex;
  flex-direction: column;
  align-items: center;
  direction: rtl;
`;

const Title = styled.div`
  font-size: 2.1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary || "#333"};
  margin-top: 150px;
  text-align: center;
`;

const SubTitle = styled.div`
  color: #7d2856;
  font-size: 1.07rem;
  margin-top: 10px;
  font-weight: 400;
  text-align: center;
  margin-bottom: 20px;
`;

const Box = styled.div`
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 32px #0002;
  padding: 2.2rem 2.1rem 2rem 2.1rem;
  width: 100%;
  max-width: 370px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const Message = styled.div`
  color: #21976b;
  background: #eaf8f3;
  border-radius: 8px;
  font-weight: 500;
  font-size: 1rem;
  text-align: center;
  padding: 10px 8px;
  margin: 10px 0 0 0;
`;

const ErrorMsg = styled.div`
  color: #cf3030;
  background: #ffecec;
  border-radius: 8px;
  font-weight: 500;
  font-size: 1rem;
  text-align: center;
  padding: 10px 8px;
  margin: 10px 0 0 0;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #b13b78;
  text-decoration: underline;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 22px;
  padding: 0;
  font-weight: 500;
  letter-spacing: 0.3px;

  &:hover {
    color: #7d2856;
  }
`;

export default function ForgotPassword() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { email: "" },
    validate: (values) => {
      const errors = {};
      if (!values.email) {
        errors.email = "נדרש אימייל";
      } else if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = "כתובת אימייל לא תקינה";
      }
      return errors;
    },
    onSubmit: async (values) => {
      setMessage("");
      setError("");
      setIsLoading(true);
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL} || http://localhost:5000/user/forgot-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: values.email }),
        });

        const data = await res.json();

        if (res.ok) {
          setMessage("קישור לאיפוס סיסמא נשלח למייל שלך.");
        } else {
          setError(data.message || "אירעה שגיאה. נסי שוב.");
        }
      } catch (err) {
        setError("שגיאה בחיבור לשרת.");
      }
      setIsLoading(false);
    },
  });

  const getFirstError = () => {
    const touched = formik.touched;
    const errors = formik.errors;

    for (const key of Object.keys(errors)) {
      if (touched[key] && errors[key]) {
        return errors[key];
      }
    }
    return null;
  };

  return (
    <BgWrapper>
      <div>
        <Title>
          שכחת סיסמה? <span style={{ fontSize: "1.4rem" }}>🔒</span>
        </Title>
        <SubTitle>
          הזיני את כתובת המייל, ונשלח אלייך קישור לאיפוס הסיסמה.
        </SubTitle>
      </div>

      <Box>
        <form
          onSubmit={formik.handleSubmit}
          style={{ width: "100%", marginTop: 0 }}
          autoComplete="off"
        >
          <LoginInput
            id="email"
            type="email"
            name="email"
            placeholder="הכנסי את כתובת האימייל שלך"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            style={{ textAlign: "right", marginBottom: 8 }}
            autoComplete="username"
            disabled={isLoading}
          />

          {getFirstError() && (
            <GlobalError style={{ marginBottom: 7 }}>{getFirstError()}</GlobalError>
          )}

          <LoginButton
            type="submit"
            disabled={isLoading}
            style={{
              width: "80%",
              marginTop: 2,
              marginBottom: isLoading ? 0 : 12,
              fontSize: "1.09rem",
              letterSpacing: 0.5,
              boxShadow: "0 2px 8px #0001",
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? "שולח..." : "שלח/י קישור לאיפוס"}
          </LoginButton>
          {isLoading && <Loader />}
        </form>

        {/* הודעות */}
        {message && (
          <Message>
            {message}
            <div style={{ color: "#6d7a88", fontSize: "0.94rem", marginTop: 4 }}>
              לא מצאת את המייל? בדקי בתיקיית הספאם או קידומי מכירות.
            </div>
          </Message>
        )}
        {error && (
          <ErrorMsg>{error}</ErrorMsg>
        )}

        <BackButton type="button" onClick={() => navigate("/")}>
          חזרה לדף הבית
        </BackButton>
      </Box>
    </BgWrapper>
  );
}
