import { Link, useNavigate } from "react-router-dom";
import { useFormik } from 'formik';
import { LoginButton, LoginDiv, LoginFormComponent, LoginInput, LoginTitle, GlobalError } from "../components/styledComponents";
import { useUser } from "../context/UserContext";
import axios from "axios";
import { useState } from "react";
import Loader from "../components/Loader";

const LoginPage = () => {

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
                errors.email = 'נדרש אימייל';
            } else if (!/\S+@\S+\.\S+/.test(values.email)) {
                errors.email = 'כתובת אימייל לא תקינה';
            }
            if (!values.password) {
                errors.password = 'נדרשת סיסמה';
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
                // const response = await axios.post(`${process.env.REACT_APP_API_URL}/user/login`, values);
                // login(response.data); // שמור את המשתמש בקונטקסט

                const {data} = await axios.post(`${process.env.REACT_APP_API_URL}/user/login`, values);
                // data = { user: {...}, token: 'JWT...' }
                login(data);           // עכשיו אנו קוראים ל־login({ user, token })
                
                setLoading(false);
                navigate('/'); // מעבר לעמוד הבית או כל עמוד אחר
            } catch (error) {
                setLoading(false);
                console.error('Login error:', error);
                formikHelpers.setFieldError('email', 'אימייל או סיסמה לא נכונים');
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
        <LoginDiv className="flex flex-col items-center justify-center h-screen bg-gray-100" style={{ direction: 'rtl' }}>

            <LoginTitle>התחברות</LoginTitle>

            <LoginFormComponent onSubmit={loginFormik.handleSubmit} style={{ textAlign: 'right' }}>

                <LoginInput
                    type="email"
                    name="email"
                    placeholder="אימייל"
                    onChange={loginFormik.handleChange}
                    onBlur={loginFormik.handleBlur}
                    value={loginFormik.values.email}
                    style={{ textAlign: 'right' }}
                />

                <LoginInput
                    type="password"
                    name="password"
                    placeholder="סיסמה"
                    onChange={loginFormik.handleChange}
                    onBlur={loginFormik.handleBlur}
                    value={loginFormik.values.password}
                    style={{ textAlign: 'right' }}
                />

                {/* הצגת שגיאה כללית מתחת לטופס */}
                {getFirstError() && (
                    <GlobalError>
                        {getFirstError()}
                    </GlobalError>
                )}

                <LoginButton type="submit">התחבר</LoginButton>
                {
                    loading?
                    <Loader/>
                    :null
                }
            </LoginFormComponent>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <Link to="/signup" style={{ display: 'block', marginBottom: '10px' }}>אין לך חשבון? הירשם</Link>
                <Link to="/forgot-password" style={{ display: 'block', marginBottom: '10px' }}>שכחת סיסמה?</Link>
                <Link to="/" style={{ display: 'block' }}>חזרה לדף הבית</Link>
            </div>
        </LoginDiv>
    );
}

export default LoginPage;
