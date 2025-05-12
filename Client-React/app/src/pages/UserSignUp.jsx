import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import axios from "axios"; // אל תשכח להתקין axios

import {
  SignUpFormComponent,
  SignUpDiv,
  SignUpInput,
  SignUpButton,
  SignUpTitle,
  GlobalError,
  StyledLink,
} from "../components/styledComponents";
import { useState } from "react";
import Loader from "../components/Loader";
import { useUser } from "../context/UserContext";

const UserSignUp = () => {
  const [loading, setLoading] = useState(false); // State to manage loading status
  const { login } = useUser(); // Import the login function from the context
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "user",
    },

    validate: (values) => {
      const errors = {};

      if (!values.name) {
        errors.name = "Name is required";
      } else if (values.name.length < 2) {
        errors.name = "Must be at least 2 characters long";
      }
      if (!values.email) {
        errors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = "Invalid email address";
      }
      if (!values.password) {
        errors.password = "Password is required";
      } else if (values.password.length < 6) {
        errors.password = "Must be at least 6 characters long";
      }
      if (!values.confirmPassword) {
        errors.confirmPassword = "Password confirmation is required";
      } else if (values.password !== values.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }

      return errors;
    },

    onSubmit: async (values, formikHelpers) => {
      const errors = await formikHelpers.validateForm();

      if (Object.keys(errors).length > 0) {
        formikHelpers.setTouched(
          Object.keys(values).reduce((acc, key) => {
            acc[key] = true;
            return acc;
          }, {})
        );
        return;
      }

      try {
        setLoading(true);

        // Check if email already exists
        const checkEmail = await axios.get(
          `${process.env.REACT_APP_API_URL}/user?email=${values.email}`
        );
        if (checkEmail.data && checkEmail.data.length > 0) {
          formikHelpers.setErrors({
            email: "A user with this email already exists",
          });
          setLoading(false);
          return;
        }

        // If email doesn't exist, proceed with signup

        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/user/`,
          values
        );
        console.log("Signup success");
        setLoading(false);

        // log the user in immediately after signup
        login(response.data);

        navigate("/signup-successful");
      } catch (error) {
        setLoading(false);
        console.error(
          "Signup error:",
          error.response ? error.response.data : error.message
        );

        if (error.response?.data?.message) {
          formikHelpers.setErrors({ email: error.response.data.message });
        } else if (error.code === 11000) {
          formikHelpers.setErrors({ email: "Email already exists" });
        } else {
          formikHelpers.setErrors({ email: "An error occurred during signup" });
        }
      }
    },
  });

  const getFirstTouchedError = () => {
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
    <SignUpDiv style={{ direction: "rtl" }}>
      <SignUpTitle>הרשמה</SignUpTitle>

      <SignUpFormComponent
        onSubmit={formik.handleSubmit}
        style={{ textAlign: "right" }}
      >
        <SignUpInput
          type="text"
          name="name"
          placeholder="שם מלא"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.name}
          style={{ textAlign: "right" }}
        />

        <SignUpInput
          type="email"
          name="email"
          placeholder="אימייל"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
          style={{ textAlign: "right" }}
        />
        <SignUpInput
          type="password"
          name="password"
          placeholder="סיסמה"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
          style={{ textAlign: "right" }}
        />
        <SignUpInput
          type="password"
          name="confirmPassword"
          placeholder="אימות סיסמה"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.confirmPassword}
          style={{ textAlign: "right" }}
        />

        {getFirstTouchedError() && (
          <GlobalError>{getFirstTouchedError()}</GlobalError>
        )}

        <SignUpButton type="submit">הרשמה</SignUpButton>
        {loading ? <Loader /> : null}
      </SignUpFormComponent>

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <Link to="/login" style={{ display: "block", marginBottom: "10px" }}>
          כבר יש לך חשבון? התחבר
        </Link>
        <StyledLink
          to="/trainer-signup"
          style={{
            display: "block",
            marginBottom: "10px",
            fontSize: "1.1rem",
            fontWeight: "bold",
            color: "#6c5ce7",
            textDecoration: "underline",
          }}
        >
          אני מעוניינת לפרסם את העסק שלי
        </StyledLink>
        <Link to="/" style={{ display: "block" }}>
          חזרה לדף הבית
        </Link>
      </div>
    </SignUpDiv>
  );
};
export default UserSignUp;
