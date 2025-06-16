//loginPage.jsx

import { Link, useNavigate } from "react-router-dom";
import { useFormik } from 'formik';
import { LoginButton, LoginDiv, LoginFormComponent, LoginInput, LoginTitle, GlobalError } from "../components/styledComponents";
import { useUser } from "../context/UserContext";
import axios from "axios";
import { useState } from "react";
import Loader from "../components/Loader";
import ReCAPTCHA from "react-google-recaptcha";

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const [captchaToken, setCaptchaToken] = useState(""); // NEW: captcha token state
    const [showPassword, setShowPassword] = useState(false);

    //OTP 
    const [requireOTP, setRequireOTP] = useState(false);
    const [otpValue, setOtpValue] = useState("");
    const [userIdForOTP, setUserIdForOTP] = useState(null);

    const { login } = useUser();
    const navigate = useNavigate();

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

            if (!captchaToken) {
                formikHelpers.setFieldError('email', 'יש לאמת שאתה לא רובוט');
                return;
            }

            try {
                setLoading(true);

                const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/user/login` || `http://localhost:5000/user/login`, {
                    ...values,
                    captchaToken
                } , {withCredentials: true});

                if (data.requireOTP) {
                    setRequireOTP(true);
                    setUserIdForOTP(data.userId);
                    setLoading(false);
                    return; // לא ממשיכים לניווט עדיין
                }

                login(data); // שומר את המשתמש בקונטקסט
                setLoading(false);
                navigate('/');

            } catch (error) {
                setLoading(false);
                console.error('Login error:', error);
                formikHelpers.setFieldError('email', 'אימייל או סיסמה לא נכונים');
            }
        }
    });

    const handleOtpSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/user/login/verify-otp`, {
                userId: userIdForOTP,
                otp: otpValue
            }, {withCredentials:true});

            login(data);
            navigate('/');
        } catch (error) {
            alert("OTP לא תקף או שגוי");
        } finally {
            setLoading(false);
        }
    };

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

                {/* 🔐 שדה סיסמה עם עין מעוצבת */}
                <div style={{ position: "relative" }}>
                    <LoginInput
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="סיסמה"
                        onChange={loginFormik.handleChange}
                        onBlur={loginFormik.handleBlur}
                        value={loginFormik.values.password}
                        style={{
                            textAlign: 'right',
                            paddingLeft: "40px" // מקום לאייקון
                        }}
                    />

                    {/* 👁 עין בעיצוב מינימלי */}
                    <span
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "10px",
                            transform: "translateY(-50%)",
                            cursor: "pointer",
                            color: "rgba(0, 0, 0, 0.4)", // אפור שקפקף
                            fontSize: "18px",
                            userSelect: "none"
                        }}
                        title={showPassword ? "הסתר סיסמה" : "הצג סיסמה"}
                    >
                        {showPassword ? "🔓" : "🔒"}
                    </span>
                </div>


                {/* NEW: CAPTCHA component */}
                <div style={{ margin: '15px 0' }}>
                    <ReCAPTCHA
                        sitekey="6LdyKzsrAAAAAB4-WBWTLifFkpyi-fSU26QSYuN1"// 👈 שימי כאן את המפתח מ־Google
                        onChange={(token) => setCaptchaToken(token)}
                    />
                </div>

                {requireOTP && (
                    <form onSubmit={handleOtpSubmit} style={{ marginTop: "20px", textAlign: 'right' }}>
                        <label>נא להקליד את קוד ה־OTP שנשלח למייל</label>
                        <LoginInput
                            type="text"
                            value={otpValue}
                            onChange={(e) => setOtpValue(e.target.value)}
                            placeholder="קוד אימות"
                        />
                        <LoginButton type="submit">אימות</LoginButton>
                    </form>
                )}

                {getFirstError() && (
                    <GlobalError>
                        {getFirstError()}
                    </GlobalError>
                )}

                <LoginButton type="submit">התחבר</LoginButton>

                {loading ? <Loader /> : null}
            </LoginFormComponent>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <Link to="/signup" style={{ display: 'block', marginBottom: '10px' }}>אין לך חשבון? הירשם</Link>
                <Link to="/forgot-password" style={{ display: 'block', marginBottom: '10px' }}>שכחת סיסמה?</Link>
                <Link to="/" style={{ display: 'block' }}>חזרה לדף הבית</Link>
            </div>
        </LoginDiv>
    );
};

export default LoginPage;
