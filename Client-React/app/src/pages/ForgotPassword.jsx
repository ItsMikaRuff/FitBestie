import { useState } from "react";
import { useFormik } from "formik";

import {
  LoginDiv,
  LoginFormComponent,
  LoginInput,
  LoginButton,
  LoginTitle,
  GlobalError,
} from "../components/styledComponents";

export default function ForgotPassword() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
 

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
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/user/forgot-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: values.email }),
        });

        const data = await res.json();

        if (res.ok) {
          setMessage("קישור לאיפוס סיסמא נשלח למייל שלך");
        } else {
          setError(data.message || "אירעה שגיאה. נסה שוב.");
        }
      } catch (err) {
        setError("שגיאה בחיבור לשרת.");
      }
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
    <LoginDiv className="flex flex-col items-center justify-center min-h-screen bg-gray-100" style={{ direction: "rtl" }}>
      <LoginTitle>שכחת סיסמה?</LoginTitle>
      <LoginFormComponent onSubmit={formik.handleSubmit} style={{ textAlign: "right" }}>
        <LoginInput
          type="email"
          name="email"
          placeholder="הכנס/י את כתובת האימייל שלך"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          style={{ textAlign: "right" }}
        />

        {getFirstError() && <GlobalError>{getFirstError()}</GlobalError>}

        <LoginButton type="submit">שלח/י קישור לאיפוס</LoginButton>
      </LoginFormComponent>

      {message && <p className="text-green-600 mt-4 text-center font-medium">{message}</p>}
      {error && <p className="text-red-600 mt-4 text-center font-medium">{error}</p>}
    </LoginDiv>
  );
}




