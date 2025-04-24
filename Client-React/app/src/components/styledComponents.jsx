import { Link } from 'react-router-dom';
import styled from 'styled-components';

// Global styles

export const Button = styled.button`
  background-color: ${({ theme }) => theme.colors.secondary};
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 2rem;
  font-size: 0.8rem;
  font-weight: 500;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.accent};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const Card = styled.div`
  background: white;
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-4px);
  }
`;

export const SectionTitle = styled.h2`
  font-size: 2rem;
  text-align: center;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.primary};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1.5rem;
  }
`;

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 1.5rem 1rem;
  }
`;


// Header & Footer styles

export const HeaderStyle = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  background-color: #333;
  color: #fff;
  padding: 10px 20px;
  width: 100%;
  z-index: 1000;
  box-sizing: border-box;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    text-align: center;
  }
`;



export const HeaderButtonDiv = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
  }
`;

export const HeaderTitle = styled.h1`
    font-size: 1.5rem;
    font-weight: bold;
    margin: 0;
    white-space: nowrap;
`;

export const HeaderText = styled.div`
  font-size: 16px;
  margin-left: 10px;

  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
    margin: 5px 0;
  }
`;

export const HeaderButton = styled.button`
    padding: 8px 16px;
    font-size: 0.9rem;
    border-radius: 50px;
    cursor: pointer;
    font-weight: 600;
    white-space: nowrap;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

export const FooterStyle = styled.footer`
    background-color: #333;
    color: #fff;
    padding: 10px;
    justify-content: space-between;
    display: flex;
    bottom: 0;
`;

export const FooterText = styled.p`
    font-size: 1rem;
    margin: 0;
    font-weight: normal;
`;

export const FooterLink = styled.a`
    color: #fff;
    text-decoration: none;
    &:hover {
        text-decoration: underline;
    }
`;

// Homepage styles
export const HomepageContainer = styled.div`
    width: 100%;
    min-height: 100vh;
    overflow-x: hidden;
    position: relative;
    box-sizing: border-box;
`;

export const HomepageBackground = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    filter: brightness(50%);
    z-index: -1;
`;

export const ButtonLogin = styled(HeaderButton)`
    background: #f8eaef;
    color: #333;

    &:hover {
        transform: scale(1.2);
        background-color: #f8eaef;
    }
`;

export const ButtonSignup = styled(HeaderButton)`
    background: #f8eaef;
    color: #333;

    &:hover {
        transform: scale(1.2);
        background-color: #f8eaef;
    }
`;

export const WelcomeText = styled.p`
    font-size: 1.5rem;
    margin-top: 20px;
    text-align: center;
`;

export const AboutSection = styled.section`
    margin-top: 50vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 50px 20px;
`;

export const AboutBox = styled.div`
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 20px;
    padding: 30px;
    max-width: 800px;
    text-align: center;
    color: #333;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    transform: scale(0.9);
    transition: transform 0.3s ease;

    &:hover {
        transform: scale(1);
    }
`;

export const AboutTitle = styled.h2`
    font-size: 2rem;
    margin-bottom: 15px;
    font-weight: bold;
`;

export const AboutText = styled.p`
    font-size: 1.2rem;
    line-height: 1.6;
`;


// LoginForm styles

export const LoginDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #f8eaef;
`;

export const LoginTitle = styled.h1`
    font-size: 2rem;
    margin-bottom: 20px;
    color: #333;
`;

export const LoginFormComponent = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

export const LoginInput = styled.input`
    width: 300px;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 5px;
`;

export const LoginButton = styled.button`
    padding: 10px 20px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #45a049;
    }
`;

export const GlobalError = styled.div`
    color: red;
    font-size: 1em;
    margin: 10px;
    text-align: center;
`;

// SignUpForm styles

export const SignUpDiv = styled(LoginDiv)`
    background-color: #f8eaef;
`;

export const SignUpTitle = styled(LoginTitle)`
    font-size: 2rem;
    margin-bottom: 20px;
    color: #333;
`;

export const SignUpFormComponent = styled(LoginFormComponent)`
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

export const SignUpInput = styled(LoginInput)`
    width: 300px;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 5px;
`;

export const SignUpSelect = styled.select`
    width: 300px;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 5px;
`;

export const SignUpButton = styled(LoginButton)`
    padding: 10px 20px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #45a049;
    }
`;

// Profile

export const DashboardContainer = styled.div`
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    font-family: 'Arial', sans-serif;
    text-align: center;
    direction: rtl;
`;

export const ProfileSection = styled.div`
    background-color: #f7f7f7;
    border-radius: 16px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
`;

export const ProfileTitle = styled.h2`
    margin-bottom: 1rem;
    color: #333;
`;

export const Info = styled.p`
    font-size: 1rem;
    color: #555;
`;

export const ProfileButton = styled.button`
    background-color: #6c5ce7;
    color: white;
    padding: 0.6rem 1.2rem;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    margin-top: 1rem;

    &:hover {
    background-color: #5a4bcf;
    }
`;
export const StyledLink = styled(Link)`
    display: inline-block;
    margin-top: 1rem;
    text-decoration: none;
    color: #6c5ce7;

    &:hover {
    text-decoration: underline; 
    }
`;