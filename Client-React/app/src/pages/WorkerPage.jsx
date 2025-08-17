// WorkerPage.jsx

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const PageContainer = styled.div`
  padding: 20px;
  direction: rtl;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 30px;
  color: #333;
`;

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const Th = styled.th`
  background-color: #f5f5f5;
  padding: 12px;
  text-align: right;
  border-bottom: 2px solid #ddd;
  white-space: nowrap;
`;

const Td = styled.td`
  padding: 12px;
  text-align: right;
  border-bottom: 1px solid #ddd;
  white-space: nowrap;
`;

const Button = styled.button`
  padding: 8px 16px;
  margin: 0 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  &:hover { opacity: 0.9; }
`;

const ApproveButton = styled(Button)`
  background-color: #4CAF50;
  color: white;
`;

const RejectButton = styled(Button)`
  background-color: #f44336;
  color: white;
`;

function getPhone(u) {
    return (
        u.phone ||
        u.phoneNumber ||
        u?.contact?.phone ||
        u?.contact?.phoneNumber ||
        u?.address?.phone ||
        u?.address?.phoneNumber ||
        ""
    );
}

function getLast4(u) {
    // שרת עדכני מחזיר u.last4; אם לא – גוזרים בצד לקוח כמפלט בטוח
    if (u.last4 && String(u.last4).replace(/\D/g, "").length === 4) {
        return String(u.last4).replace(/\D/g, "");
    }
    const raw = u?.paymentDetails?.cardNumber;
    if (raw) {
        const digits = String(raw).replace(/\D/g, "");
        if (digits.length >= 4) return digits.slice(-4);
    }
    const l4 = u?.paymentDetails?.last4;
    if (l4 && String(l4).replace(/\D/g, "").length === 4) {
        return String(l4).replace(/\D/g, "");
    }
    return null;
}

const WorkerPage = () => {
    const { user, token } = useUser();
    const [pendingTrainers, setPendingTrainers] = useState([]);
    const navigate = useNavigate();

    const isAllowed = ["worker", "superadmin", "manager"].includes(
        (user?.role || "").toLowerCase()
    );

    const fetchPendingTrainers = useCallback(async () => {
        if (!token || !isAllowed) return;
        const { data } = await axios.get(`${API_URL}/user/pending-trainers`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
        });
        // נורמליזציה כדי לא לשבור גם אם השרת עוד לא מעודכן
        const normalized = (Array.isArray(data) ? data : []).map((t) => ({
            ...t,
            phone: getPhone(t),
            last4: getLast4(t),
        }));
        setPendingTrainers(normalized);
    }, [token, isAllowed]);

    useEffect(() => {
        fetchPendingTrainers();
    }, [user, navigate, fetchPendingTrainers]);

    const handleApprove = async (trainerId) => {
        if (!token) return;
        await axios.post(
            `${API_URL}/user/approve-trainer/${trainerId}`,
            {},
            { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
        );
        fetchPendingTrainers();
    };

    const handleReject = async (trainerId) => {
        if (!token) return;
        await axios.post(
            `${API_URL}/user/reject-trainer/${trainerId}`,
            {},
            { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
        );
        fetchPendingTrainers();
    };

    if (!isAllowed) return null;

    return (
        <PageContainer>
            <Title>מאמנות \ סטודיו בהמתנה</Title>
            <TableContainer>
                <Table>
                    <thead>
                        <tr>
                            <Th>שם</Th>
                            <Th>אימייל</Th>
                            <Th>טלפון</Th>
                            <Th>כרטיס (4 ספרות)</Th>
                            <Th>פעולות</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingTrainers.map((trainer) => (
                            <tr key={trainer._id}>
                                <Td>{trainer.name}</Td>
                                <Td>{trainer.email}</Td>
                                <Td>{trainer.phone || "—"}</Td>
                                <Td>{trainer.last4 ? `**** ${trainer.last4}` : "—"}</Td>
                                <Td>
                                    <ApproveButton onClick={() => handleApprove(trainer._id)}>
                                        אישור
                                    </ApproveButton>
                                    <RejectButton onClick={() => handleReject(trainer._id)}>
                                        דחייה
                                    </RejectButton>
                                </Td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </TableContainer>
        </PageContainer>
    );
};

export default WorkerPage;
