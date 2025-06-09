import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import {
  DashboardContainer,
  ProfileButton,
  ProfileSection,
  ProfileTitle,
} from "../components/styledComponents";
import styled from "styled-components";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Responsive table container
const TableContainer = styled.div`
  direction: rtl;
  text-align: right;
  width: 100%;
  overflow-x: auto;
  margin-top: 2rem;
`;

// Styled table
const UserTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
  direction: rtl;
  text-align: right;

  th,
  td {
    padding: 0.75rem 1rem;
    text-align: left;
  }

  th {
    background: #6c5ce7;
    color: #fff;
    font-weight: 600;
    font-size: 1rem;
  }

  tr:nth-child(even) {
    background: #f7f7fb;
  }

  tr:nth-child(odd) {
    background: #f0f0f7;
  }

  @media (max-width: 700px) {
    font-size: 0.9rem;
    th,
    td {
      padding: 0.5rem 0.3rem;
    }
  }
`;

// Action buttons
const ActionButton = styled.button`
  background: ${({ color }) => color || "#6c5ce7"};
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.4rem 0.9rem;
  margin: 0 0.2rem;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: ${({ color }) => (color === "#dc3545" ? "#b52a37" : "#4834d4")};
  }
`;

const FormCard = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
  padding: 2rem;
  max-width: 400px;
  margin: 2rem auto 0 auto;
`;

export const ResponsiveContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
  @media (max-width: 700px) {
    padding: 1rem 0.2rem;
  }
`;

export const ProfileCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
  padding: 2rem;
  margin-bottom: 2rem;
  @media (max-width: 700px) {
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    gap: 1rem;
  }
`;

export const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #6c5ce7;
  @media (max-width: 700px) {
    width: 100px;
    height: 100px;
  }
`;

export const ProfileInfo = styled.div`
  flex: 1;
  min-width: 0;
  @media (max-width: 700px) {
    text-align: center;
    width: 100%;
  }
`;

const AdminPage = () => {

    // Get user from context 
    const { user } = useUser();

    // Form state
    const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
    
    });

    // Message state
    const [message, setMessage] = useState("");
    // Users state
    const [users, setUsers] = useState([]);
    // Edit user state
    const [editId, setEditId] = useState(null);
    // Edit form state
    const [editForm, setEditForm] = useState({ name: "", email: "", role: "" });

  // Fetch all users on mount
  useEffect(() => {
    if (   user?.role?.toLowerCase() === "admin" || user?.role?.toLowerCase() === "superadmin"  ) {

      axios
        .get(`${API_URL}/user`, { withCredentials: true })
        .then((res) => {
          // If user is admin, filter out superAdmin users
          if (user?.role?.toLowerCase() === "admin") {
            setUsers(res.data.filter((u) => u.role !== "superAdmin"));
          } else {
            setUsers(res.data);
          }
        })
        .catch(() => setUsers([]));
    }
  }, [user]);

  const handleChange = (e) => {

    setForm({ ...form, [e.target.name]: e.target.value});

  };

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    // Prevent admin users from creating superAdmin users
    if (user?.role?.toLowerCase() === "admin" && form.role === "superAdmin") {
      setMessage("You don't have permission to create superAdmin users.");
      return;
    }

    // Check if email already exists

    try {
      const checkEmail = await axios.get(
        `${API_URL}/user?email=${form.email}`,
        { withCredentials: true }
      );

      if (checkEmail.data && checkEmail.data.length > 0) {
        setMessage("משתמש עם מייל זה כבר קיים.");
        return;
      }

      await axios.post(`${API_URL}/user`, form, { withCredentials: true });
      setMessage("המשתמש נוצר בהצלחה!");
      setForm({ name: "", email: "", password: "", role: "" });

      // Refresh user list

      const res = await axios.get(`${API_URL}/user`, { withCredentials: true });
      if (user?.role?.toLowerCase() === "admin") {
        setUsers(res.data.filter((u) => u.role !== "superAdmin"));

      } else {
        setUsers(res.data);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Error creating user.");
    }
  };

  // Delete user

  const handleDelete = async (id) => {
    const userToDelete = users.find((u) => u._id === id);
    // Prevent admin users from deleting superAdmin users
    if (
      user?.role?.toLowerCase() === "admin" &&
      userToDelete?.role === "superAdmin"
    ) {
      alert("You don't have permission to delete superAdmin users.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`${API_URL}/user/${id}`, { withCredentials: true });
      setUsers(users.filter((u) => u._id !== id));
    } catch {
      alert("Failed to delete user");
    }
  };

  // Start editing
  const handleEdit = (u) => {
    // Prevent admin users from editing superAdmin users
    if (user?.role?.toLowerCase() === "admin" && u.role === "superAdmin") {
      alert("You don't have permission to edit superAdmin users.");
      return;
    }
    setEditId(u._id);
    setEditForm({ name: u.name, email: u.email, role: u.role });
  };

  // Save edit
  const handleEditSave = async (id) => {

    const userToEdit = users.find((u) => u._id === id);

    // Prevent admin users from changing roles to superAdmin

    if ( user?.role?.toLowerCase() === "admin" && (userToEdit?.role === "superAdmin" || editForm.role === "superAdmin")) {
      alert("You don't have permission to edit superAdmin users or create new superAdmin users." );
      return;
    }

    
    try {
        // Check if email already exists
      const checkEmail = await axios.get(`${API_URL}/user?email=${editForm.email}`,
         { withCredentials: true });

      const existingUser = checkEmail.data.find((u) => u._id !== id);

      if (existingUser) {
        alert("משתמש עם מייל זה כבר קיים.");
        return;
      }

        // Update user
      const res = await axios.post(`${API_URL}/user/update/${id}`, editForm, {
        withCredentials: true,
      });

      setUsers(users.map((u) => (u._id === id ? res.data : u)));
      setEditId(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update user");
    }
  };

  // Send reset link
  const handleSendResetLink = async (email) => {
    try {
      await axios.post(`${API_URL}/user/admin-send-reset-link`, { email });
      alert("קישור לאיפוס סיסמה נשלח למייל של המשתמש.");
    } catch (err) {
      alert("אירעה שגיאה בשליחת הקישור.");
    }
  };

  // Reset password by admin
  const handleResetPasswordByAdmin = async (userId, newPassword) => {
    if (!newPassword) {
      alert("אנא הזן סיסמה חדשה.");
      return;
    }
  
    if (!window.confirm("האם לאפס את הסיסמה של המשתמש?")) return;
  
    try {
      await axios.post(`${API_URL}/user/admin-reset-password`, {
        userId,
        newPassword,
      }, { withCredentials: true });
  
      alert("הסיסמה אופסה בהצלחה.");
    } catch (err) {
      alert("שגיאה באיפוס הסיסמה.");
    }
  };

  // Cancel edit
  const handleEditCancel = () => setEditId(null);

  if (
    !user ||
    (user.role?.toLowerCase() !== "admin" && user.role !== "superAdmin")
  ) {
    return <p>Unauthorized</p>;
  }

  return (
    <DashboardContainer>
      <ProfileSection>
        <ProfileTitle>הקמת משתמש חדש</ProfileTitle>
        <FormCard>
          <form onSubmit={handleSubmit}>
            <div>
              <label>שם מלא</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>סיסמא</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>אימות סיסמא</label>
              <input
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>הרשאות</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                required
              >
                <option value="user">Regular User</option>
                <option value="trainer">Trainer</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="worker">Worker</option>
                {user?.role === "superAdmin" && (
                  <option value="superAdmin">Super Admin</option>
                )}
              </select>
            </div>

            <ProfileButton type="submit">הקמת משתמש חדש</ProfileButton>
          </form>
          {message && (
            <p style={{ textAlign: "center", color: "#6c5ce7" }}>{message}</p>
          )}
        </FormCard>
      </ProfileSection>

      <ProfileSection>
        <ProfileTitle>ניהול משתמשים</ProfileTitle>
        <TableContainer>
          <UserTable>
            <thead>
              <tr>
                <th>שם משתמש</th>
                <th>Email</th>
                <th>הרשאות</th>
                <th style={{ minWidth: 120 }}>פעולה</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>
                    {editId === u._id ? (
                      <input
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                        style={{ minWidth: 80 }}
                      />
                    ) : (
                      u.name
                    )}
                  </td>
                  <td>
                    {editId === u._id ? (
                      <input
                        value={editForm.email}
                        onChange={(e) =>
                          setEditForm({ ...editForm, email: e.target.value })
                        }
                        style={{ minWidth: 120 }}
                      />
                    ) : (
                      u.email
                    )}
                  </td>
                  <td>
                    {editId === u._id ? (
                      <select
                        value={editForm.role}
                        onChange={(e) =>
                          setEditForm({ ...editForm, role: e.target.value })
                        }
                        style={{ padding: "0.3rem", borderRadius: 6 }}
                      >
                        <option value="user">Regular User</option>
                        <option value="trainer">Trainer</option>
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                        <option value="worker">Worker</option>
                        {user?.role === "superAdmin" && (
                          <option value="superAdmin">Super Admin</option>
                        )}
                      </select>
                    ) : (
                      u.role
                    )}
                  </td>
                  <td>
                    {editId === u._id ? (
                      <>
                        <ActionButton
                          onClick={() => handleEditSave(u._id)}
                          color="#6c5ce7"
                        >
                          שמירה
                        </ActionButton>
                        <ActionButton onClick={handleEditCancel} color="#888">
                          ביטול
                        </ActionButton>
                      </>
                    ) : (
                      <>
                        <ActionButton
                          onClick={() => handleEdit(u)}
                          color="#6c5ce7"
                        >
                          עריכה
                        </ActionButton>
                        <ActionButton
                          onClick={() => handleDelete(u._id)}
                          color="#dc3545"
                        >
                          מחיקת משתמש
                        </ActionButton>
                      </>
                    )}

                     {/* הצגת כפתורי איפוס סיסמה תמיד, גם בעריכה */}
                     <div style={{ marginTop: "0.5rem" }}>
                      <ActionButton onClick={() => handleSendResetLink(u.email)}>
                        שליחת קישור איפוס סיסמא
                      </ActionButton>
                    </div>

                    <div style={{ marginTop: "0.5rem" }}>
                      <input
                        type="password"
                        placeholder="סיסמה חדשה"
                        onChange={(e) => u.newPassword = e.target.value}
                        style={{ padding: "0.3rem", marginRight: "0.5rem" }}
                      />
                      <ActionButton
                        onClick={() => handleResetPasswordByAdmin(u._id, u.newPassword)}
                        color="#17a2b8"
                      >
                        אפס סיסמה ידנית
                      </ActionButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </UserTable>
        </TableContainer>
      </ProfileSection>
    </DashboardContainer>
  );
};

export default AdminPage;
