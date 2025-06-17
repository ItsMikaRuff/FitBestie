import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  LoginDiv,
  LoginInput,
  LoginButton,
  LoginTitle,
  GlobalError,
  LoginFormComponent,
} from "../components/styledComponents";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setError("קישור לא תקין או פג תוקף.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/user/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
    
      const data = await res.json();
    
      if (res.ok) {
        setMessage("הסיסמה אופסה בהצלחה!");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setError(data.message || "אירעה שגיאה.");
      }
    } catch (err) {
      setError("שגיאה בחיבור לשרת.");
    }

  //   try {
  //     const res = await fetch(`${process.env.REACT_APP_API_URL} || http://localhost:5000/user/reset-password`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ token, password }),
  //     });

  //     const data = await res.json();
  //     if (res.ok) {
  //       setMessage("הסיסמה אופסה בהצלחה!");
  //       setTimeout(() => navigate("/login"), 3000);
  //     } else {
  //       setError(data.message || "אירעה שגיאה.");
  //     }
  //   } catch (err) {
  //     setError("שגיאה בחיבור לשרת.");
    
  };

  return (
    <LoginDiv className="flex flex-col items-center justify-center min-h-screen bg-gray-100" style={{ direction: 'rtl' }}>
      <LoginTitle>איפוס סיסמה</LoginTitle>

      {error && <GlobalError>{error}</GlobalError>}
      {message && <p className="text-green-600 text-center mb-4">{message}</p>}

      {!message && token && (
        <LoginFormComponent onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px', textAlign: 'right' }}>
          <LoginInput
            type="password"
            placeholder="סיסמה חדשה"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <LoginButton type="submit">אפס סיסמה</LoginButton>
        </LoginFormComponent>
      )}
    </LoginDiv>
  );
}



// import { useState, useEffect } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";

// export default function ResetPassword() {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const token = searchParams.get("token");

//   useEffect(() => {
//     if (!token) {
//       setError("קישור לא תקין או פג תוקף.");
//     }
//   }, [token]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setError("");

//     try {
//       const res = await fetch(`${process.env.REACT_APP_API_URL}/user/reset-password`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ token, password }),
//       });

//       const data = await res.json();
//       if (res.ok) {
//         setMessage("הסיסמה אופסה בהצלחה!");
//         setTimeout(() => navigate("/login"), 3000); // מעבר אוטומטי להתחברות
//       } else {
//         setError(data.message || "אירעה שגיאה.");
//       }
//     } catch (err) {
//       setError("שגיאה בחיבור לשרת.");
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-md">
//       <h2 className="text-2xl font-semibold mb-4 text-center">איפוס סיסמה</h2>
//       {error && <p className="text-red-600 mb-2">{error}</p>}
//       {message && <p className="text-green-600 mb-2">{message}</p>}
//       {!message && token && (
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             type="password"
//             placeholder="סיסמה חדשה"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full p-3 border border-gray-300 rounded-md"
//             required
//           />
//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
//           >
//             אפס סיסמה
//           </button>
//         </form>
//       )}
//     </div>
//   );
// }
