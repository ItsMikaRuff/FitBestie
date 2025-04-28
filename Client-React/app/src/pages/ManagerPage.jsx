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

    useEffect(() => {
        if (user?.role?.toLowerCase() === "superadmin" || user?.role?.toLowerCase() === "manager") {
            axios.get(`${API_URL}/user`, { withCredentials: true })
                .then(res => {
                    setUsers(res.data);
                    // Calculate statistics
                    const roleCounts = res.data.reduce((acc, u) => {
                        acc[u.role] = (acc[u.role] || 0) + 1;
                        return acc;
                    }, {});
                    setStats({
                        total: res.data.length,
                        ...roleCounts
                    });
                });
        }
    }, [user]);

    const handleExport = () => {
        // Export as CSV
        const csvRows = [
            ["שם", "אימייל", "תפקיד"],
            ...users.map(u => [u.name, u.email, u.role])
        ];
        const csvContent = csvRows.map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "סטטיסטיקת_משתמשים.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    if (!user || (user.role?.toLowerCase() !== "superadmin" && user.role?.toLowerCase() !== "manager")) {
        return <p>אין הרשאה</p>;
    }

    return (
        <DashboardContainer style={{ direction: 'rtl' }}>
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
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u._id}>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>{u.role}</td>
                                </tr>
                            ))}
                        </tbody>
                    </StyledTable>
                </div>
            </ProfileSection>
        </DashboardContainer>
    );
};

export default ManagerPage;
