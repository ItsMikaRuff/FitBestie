import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import Loader from '../components/Loader';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const ResultsContainer = styled.div`
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
`;

const SearchHeader = styled.div`
    margin-bottom: 2rem;
    text-align: center;
`;

const SearchTitle = styled.h1`
    font-size: 2rem;
    color: #333;
    margin-bottom: 1rem;
`;

const SearchSubtitle = styled.p`
    color: #666;
    font-size: 1.1rem;
`;

const ResultsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
`;

const ResultCard = styled.div`
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    overflow: hidden;
    transition: transform 0.3s ease;

    &:hover {
        transform: translateY(-5px);
    }
`;

const ResultImage = styled.img`
    width: 100%;
    height: 200px;
    object-fit: cover;
`;

const ResultContent = styled.div`
    padding: 1.5rem;
`;

const ResultName = styled.h2`
    font-size: 1.5rem;
    color: #333;
    margin-bottom: 0.5rem;
`;

const ResultType = styled.span`
    display: inline-block;
    padding: 0.25rem 0.75rem;
    background: #6c5ce7;
    color: white;
    border-radius: 20px;
    font-size: 0.9rem;
    margin-bottom: 1rem;
`;

const ResultInfo = styled.p`
    color: #666;
    margin-bottom: 0.5rem;
`;

const ResultButton = styled.button`
    width: 100%;
    padding: 0.8rem;
    background: #6c5ce7;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background: #5b4bc4;
    }
`;

const FilterContainer = styled.div`
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
`;

const FilterButton = styled.button`
    padding: 0.5rem 1rem;
    border: 1px solid #ddd;
    border-radius: 20px;
    background: ${props => props.$active ? '#6c5ce7' : 'white'};
    color: ${props => props.$active ? 'white' : '#333'};
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        border-color: #6c5ce7;
    }
`;

const SearchTrainerResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isLoggedIn } = useUser();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all');

    const searchType = new URLSearchParams(location.search).get('type');

    useEffect(() => {
        const fetchResults = async () => {
            try {
                setLoading(true);
                console.log('Fetching results for type:', searchType);
                const response = await axios.get(`${API_URL}/search?type=${searchType}`);
                console.log('Search results:', response.data);
                setResults(response.data);
            } catch (err) {
                console.error('Search error:', err.response?.data || err.message);
                setError(err.response?.data?.message || 'שגיאה בטעינת התוצאות');
            } finally {
                setLoading(false);
            }
        };

        if (searchType) {
            fetchResults();
        } else {
            setError('נא לבחור סוג חיפוש');
        }
    }, [searchType]);

    const filteredResults = results.filter(result => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'trainers') return result.role === 'trainer';
        if (activeFilter === 'studios') return result.role === 'studio';
        return true;
    });

    const handleContact = (resultId) => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }
        // TODO: Implement contact functionality
        console.log('Contacting:', resultId);
    };

    if (loading) return <Loader />;
    if (error) return <div>{error}</div>;

    return (
        <ResultsContainer>
            <SearchHeader>
                <SearchTitle>חיפוש מאמנים</SearchTitle>
                <SearchSubtitle>מצאנו {filteredResults.length} מאמנים באזור שלך</SearchSubtitle>
            </SearchHeader>

            <FilterContainer>
                <FilterButton 
                    $active={activeFilter === 'all'} 
                    onClick={() => setActiveFilter('all')}
                >
                    הכל
                </FilterButton>
                <FilterButton 
                    $active={activeFilter === 'trainers'} 
                    onClick={() => setActiveFilter('trainers')}
                >
                    מאמנות אישיות
                </FilterButton>
                <FilterButton 
                    $active={activeFilter === 'studios'} 
                    onClick={() => setActiveFilter('studios')}
                >
                    מאמנות קבוצתיות
                </FilterButton>
            </FilterContainer>

            <ResultsGrid>
                {filteredResults.map(result => (
                    <ResultCard key={result._id}>
                        <ResultImage 
                            src={result.image || "https://placehold.co/300x200"} 
                            alt={result.name}
                        />
                        <ResultContent>
                            <ResultName>{result.name}</ResultName>
                            <ResultType>
                                {result.role === 'trainer' ? 'מאמנת אישית' : 'מאמנת קבוצתית'}
                            </ResultType>
                            <ResultInfo>📍 {result.address?.city || 'לא זמין'}</ResultInfo>
                            {result.role === 'trainer' && (
                                <ResultInfo>💪 {result.expertise?.join(', ') || 'לא זמין'}</ResultInfo>
                            )}
                            <ResultButton onClick={() => handleContact(result._id)}>
                                צור קשר
                            </ResultButton>
                        </ResultContent>
                    </ResultCard>
                ))}
            </ResultsGrid>
        </ResultsContainer>
    );
};

export default SearchTrainerResults; 