import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import axios from "axios"; // אל תשכח להתקין axios

import { SignUpFormComponent, SignUpDiv, SignUpInput, SignUpButton, SignUpSelect, SignUpTitle, GlobalError } from "../components/styledComponents";

const SignUpForm = () => {

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
                await axios.post("http://localhost:5000/user", values);
                console.log("Signup success");

                // Handle successful signup (e.g., redirect to login page or show success message)
                navigate("/SignUpSuccessful"); // Redirect to the success page
            } catch (error) {
                console.error("Signup error:", error.response ? error.response.data : error.message);
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

    return <SignUpDiv>

        <SignUpTitle>Sign Up</SignUpTitle>

        <SignUpFormComponent onSubmit={formik.handleSubmit}>

            <SignUpInput
                type="text"
                name="name"
                placeholder="Full Name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
            />

            <SignUpInput
                type="email"
                name="email"
                placeholder="Email"
                onChange={formik.handleChange}
                value={formik.values.email}
            />
            <SignUpInput
                type="password"
                name="password"
                placeholder="Password"
                onChange={formik.handleChange}
                value={formik.values.password}
            />
            <SignUpInput
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                onChange={formik.handleChange}
                value={formik.values.confirmPassword}
            />
            <SignUpSelect
                name="role"
                onChange={formik.handleChange}
                value={formik.values.role}
                placeholder=" "
            >
                <option value="user">Regular User</option>
                <option value="trainer">Fitness Trainer</option>

            </SignUpSelect>

            {/* הצגת שגיאה כללית מתחת לטופס */}
            {getFirstError() && (
                <GlobalError>
                    {getFirstError()}
                </GlobalError>
            )}

            <SignUpButton type="submit">Sign Up</SignUpButton>



        </SignUpFormComponent>

        <br />
        <Link to="/login">Already have an account? Login</Link>
        <br />
        <Link to="/">Back to Home</Link>
        <br />

    </SignUpDiv>

}
export default SignUpForm;
