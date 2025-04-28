import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import { DashboardContainer, ProfileSection, ProfileTitle, ProfileButton } from "../components/styledComponents";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

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
            ["Name", "Email", "Role"],
            ...users.map(u => [u.name, u.email, u.role])
        ];
        const csvContent = csvRows.map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "users_statistics.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    if (!user || (user.role?.toLowerCase() !== "superadmin" && user.role?.toLowerCase() !== "manager")) {
        return <p>Unauthorized</p>;
    }

    return (
        <DashboardContainer>
            <ProfileSection>
                <ProfileTitle>📊 User Statistics</ProfileTitle>
                <ul>
                    <li><b>Total users:</b> {stats.total || 0}</li>
                    <li><b>Regular users:</b> {stats.user || 0}</li>
                    <li><b>Trainers:</b> {stats.trainer || 0}</li>
                    <li><b>Admins:</b> {stats.admin || 0}</li>
                    <li><b>Managers:</b> {stats.manager || 0}</li>
                </ul>
                <ProfileButton onClick={handleExport}>Export Users as CSV</ProfileButton>
            </ProfileSection>
            <ProfileSection>
                <ProfileTitle>All Users</ProfileTitle>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
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
                    </table>
                </div>
            </ProfileSection>
        </DashboardContainer>
    );
};

export default ManagerPage;
