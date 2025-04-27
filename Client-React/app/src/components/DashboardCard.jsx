import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

//זה הכרטיס שיופיע בדף הבית אחרי התחברות של משתמש, ניתן לשים כמה כרטיסים כאלו.
const Card = styled.div`
    background-color: white;
    color: #333;
    border-radius: 20px;
    padding: 2rem;
    margin: 1rem;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
    text-align: center;
    max-width: 400px;
    width: 100%;

    &:hover {
        transform: translateY(-5px);
    }
`;

const CardTitle = styled.h2`
    color: #333;
    font-size: 1.5rem;
    margin-bottom: 1rem;
`;

const CardText = styled.p`
    color: #666;
    margin-bottom: 1.5rem;
    line-height: 1.6;
`;

const CardButton = styled.button`
    background-color: #6c5ce7;
    color: white;
    padding: 0.8rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
    width: 100%;

    &:hover {
        background-color: #5a4bcf;
    }
`;

const CardsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 2rem;
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
`;

const DashboardCard = ({ title, description, buttonText, buttonLink }) => {
    return (
        <Card>
            <CardTitle>{title}</CardTitle>
            <CardText>{description}</CardText>
            {buttonText && buttonLink && (
                <Link to={buttonLink}>
                    <CardButton>{buttonText}</CardButton>
                </Link>
            )}
        </Card>
    );
};

export { DashboardCard, CardsContainer };
