import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';

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
`;

const Td = styled.td`
    padding: 12px;
    text-align: right;
    border-bottom: 1px solid #ddd;
`;

const Button = styled.button`
    padding: 8px 16px;
    margin: 0 5px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.3s ease;

    &:hover {
        opacity: 0.9;
    }
`;

const ApproveButton = styled(Button)`
    background-color: #4CAF50;
    color: white;
`;

const RejectButton = styled(Button)`
    background-color: #f44336;
    color: white;
`;

const PaymentInfo = styled.div`
    margin-top: 10px;
    padding: 10px;
    background-color: #f9f9f9;
    border-radius: 4px;
`;

const WorkerPage = () => {
    const { user, token } = useUser();
    const [pendingTrainers, setPendingTrainers] = useState([]);
    const navigate = useNavigate();

    const fetchPendingTrainers = useCallback(async () => {
        if (!token) return;  // כעת token אמור להיות מלא
        const { data } = await axios.get(
            `${API_URL}/user/pending-trainers`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setPendingTrainers(data);
    }, [token]);

    useEffect(() => {
        
        fetchPendingTrainers();
    }, [user, navigate, fetchPendingTrainers]);

    const handleApprove = async (trainerId) => {
        if (!token) return;
        try {
            await axios.post(
                `${API_URL}/user/approve-trainer/${trainerId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchPendingTrainers();
        } catch (error) {
            console.error('Error approving trainer:', error);
        }
    };

    const handleReject = async (trainerId) => {
        if (!token) return;
        try {
            await axios.post(
                `${API_URL}/user/reject-trainer/${trainerId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchPendingTrainers();
        } catch (error) {
            console.error('Error rejecting trainer:', error);
        }
    };

    if (!user || (user.role !== 'worker' && user.role !== 'superAdmin')) {
        return null;
    }

    if (user === undefined) return null;
    if (!user || (user.role !== 'worker' && user.role !== 'superAdmin')) return null;

    return (
        <PageContainer>
            <Title>מאמנות \ סטודיו בהמתנה</Title>
            <TableContainer>
                <Table>
                    <thead>
                        <tr>
                            <Th>שם</Th>
                            <Th>אימייל</Th>
                            <Th>פרטי תשלום</Th>
                            <Th>פעולות</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingTrainers.map((trainer) => (
                            <tr key={trainer._id}>
                                <Td>{trainer.name}</Td>
                                <Td>{trainer.email}</Td>
                                <Td>
                                    <PaymentInfo>
                                        <p>מספר כרטיס: {trainer.paymentDetails?.cardNumber}</p>
                                        <p>תוקף: {trainer.paymentDetails?.expiryDate}</p>
                                    </PaymentInfo>
                                </Td>
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
