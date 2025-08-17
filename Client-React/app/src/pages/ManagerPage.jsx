// ManagerPage.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import { DashboardContainer, ProfileSection, ProfileTitle, ProfileButton } from "../components/styledComponents";
import styled from "styled-components";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  direction: rtl;
  text-align: right;

  th, td {
    padding: 12px;
    border-bottom: 1px solid #ddd;
  }

  th {
    background-color: #f5f5f5;
    font-weight: bold;
  }

  tr:hover {
    background-color: #f9f9f9;
  }
`;

const StatsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 20px 0;
  direction: rtl;
  text-align: right;

  li {
    margin-bottom: 10px;
    font-size: 1.1rem;
  }
`;

const ManagerPage = () => {
    const { user } = useUser();
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({});
    const [extraStats, setExtraStats] = useState(null);

    // סטטיסטיקות שימוש (סה"כ התחברויות + TOP5)
    useEffect(() => {
        const allowed = ["superadmin", "manager"].includes((user?.role || "").toLowerCase());
        if (!allowed) return;

        axios
            .get(`${API_URL}/user/admin/simple-stats`, { withCredentials: true })
            .then((res) => setExtraStats(res.data))
            .catch(() => setExtraStats(null));
    }, [user]);

    // רשימת משתמשים + טלפון
    useEffect(() => {
        const role = (user?.role || "").toLowerCase();
        const allowed = role === "superadmin" || role === "manager";
        if (!allowed) return;

        axios
            .get(`${API_URL}/user`, { withCredentials: true })
            .then((res) => {
                const list = (res.data || []).map((u) => ({
                    ...u,
                    phone:
                        u.phone ||
                        u.phoneNumber ||
                        u?.contact?.phone ||
                        u?.address?.phone ||
                        "",
                }));
                setUsers(list);

                const roleCounts = list.reduce((acc, u) => {
                    acc[u.role] = (acc[u.role] || 0) + 1;
                    return acc;
                }, {});
                setStats({
                    total: list.length,
                    ...roleCounts,
                });
            })
            .catch(() => {
                setUsers([]);
                setStats({});
            });
    }, [user]);

    const handleExport = () => {
        const csvRows = [
            ["שם", "אימייל", "תפקיד", "טלפון"],
            ...users.map((u) => [u.name || "", u.email || "", u.role || "", u.phone || ""]),
        ];
        const csvContent = "\uFEFF" + csvRows.map((e) => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "סטטיסטיקת_משתמשים.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    const notAllowed =
        !user ||
        (user.role?.toLowerCase() !== "superadmin" &&
            user.role?.toLowerCase() !== "manager");

    if (notAllowed) {
        return <p>אין הרשאה</p>;
    }

    return (
        <DashboardContainer style={{ direction: "rtl" }}>
            <ProfileSection>
                <ProfileTitle>📊 סטטיסטיקת משתמשים</ProfileTitle>
                <StatsList>
                    <li><b>סך הכל משתמשים:</b> {stats.total || 0}</li>
                    <li><b>משתמשים רגילים:</b> {stats.user || 0}</li>
                    <li><b>מאמנים:</b> {stats.trainer || 0}</li>
                    <li><b>מנהלים:</b> {stats.admin || 0}</li>
                    <li><b>מנהלי מערכת:</b> {stats.manager || 0}</li>
                </StatsList>
                <ProfileButton onClick={handleExport}>ייצוא משתמשים ל-CSV</ProfileButton>
            </ProfileSection>



            <ProfileSection>
                <ProfileTitle>כל המשתמשים</ProfileTitle>
                <div style={{ overflowX: "auto" }}>
                    <StyledTable>
                        <thead>
                            <tr>
                                <th>שם</th>
                                <th>אימייל</th>
                                <th>תפקיד</th>
                                <th>טלפון</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u._id}>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>{u.role}</td>
                                    <td>{u.phone || "—"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </StyledTable>
                </div>
            </ProfileSection>

            {extraStats && (
                <ProfileSection>
                    <ProfileTitle>סטטיסטיקות שימוש</ProfileTitle>
                    <StatsList>
                        <li><b>סה״כ התחברויות:</b> {extraStats.totalLogins ?? 0}</li>
                        <li><b>Top 5 לפי התחברויות:</b></li>
                        {(extraStats.topLogins || []).map((u) => (
                            <li key={u.email || u._id || u.name}>
                                • {u.name || u.email} — {u.loginCount || 0}
                            </li>
                        ))}
                    </StatsList>
                </ProfileSection>
            )}
            
        </DashboardContainer>
    );
};

export default ManagerPage;
