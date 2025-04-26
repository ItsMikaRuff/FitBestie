import { Link, useNavigate } from "react-router-dom";
import { useFormik } from 'formik';
import { LoginButton, LoginDiv, LoginFormComponent, LoginInput, LoginTitle, GlobalError } from "../components/styledComponents";
import { useUser } from "../context/UserContext";
import axios from "axios";
import { useState } from "react";
import Loader from "../components/Loader";

const LoginForm = () => {

    const [loading, setLoading] = useState(false); // State to manage loading status
    const { login } = useUser(); // Import the login function from the context
    const navigate = useNavigate(); // Import the useNavigate hook


    const loginFormik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },

        validate: (values) => {
            const errors = {};

            if (!values.email) {
                errors.email = 'Email is required';
            } else if (!/\S+@\S+\.\S+/.test(values.email)) {
                errors.email = 'Invalid email address';
            }
            if (!values.password) {
                errors.password = 'Password is required';
            } else if (values.password.length < 6) {
                errors.password = 'Must be at least 6 characters long';
            }
            return errors;
        },

        onSubmit: async (values, formikHelpers) => {

            console.log('login clicked');

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
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/user/login`, values);
                login(response.data); // שמור את המשתמש בקונטקסט
                setLoading(false);
                navigate('/'); // מעבר לעמוד הבית או כל עמוד אחר
            } catch (error) {
                setLoading(false);
                console.error('Login error:', error);
                formikHelpers.setFieldError('email', 'Invalid email or password');
            }


        }
    });

    const getFirstError = () => {
        const touched = loginFormik.touched;
        const errors = loginFormik.errors;

        for (const key of Object.keys(errors)) {
            if (touched[key] && errors[key]) {
                return errors[key];
            }
        }
        return null;
    };


    return (
        <LoginDiv className="flex flex-col items-center justify-center h-screen bg-gray-100">

            <LoginTitle>Login</LoginTitle>

            <LoginFormComponent onSubmit={loginFormik.handleSubmit}>

                <LoginInput
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={loginFormik.handleChange}
                    onBlur={loginFormik.handleBlur}
                    value={loginFormik.values.email}
                />

                <LoginInput
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={loginFormik.handleChange}
                    onBlur={loginFormik.handleBlur}
                    value={loginFormik.values.password}
                />

                {/* הצגת שגיאה כללית מתחת לטופס */}

                {getFirstError() && (
                    <GlobalError>
                        {getFirstError()}
                    </GlobalError>
                )}

                <LoginButton type="submit">Login</LoginButton>
                {
                    loading?
                    <Loader/>
                    :null
                }
            </LoginFormComponent>

            <Link to="/signup">Don&apos;t have an account? Sign up</Link>
            <br />
            <Link to="/forgot-password">Forgot password?</Link>
            <br />
            <Link to="/">Back to Home</Link>
        </LoginDiv>
    );
}

export default LoginForm;
