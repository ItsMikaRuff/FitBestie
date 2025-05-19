import { Link } from 'react-router-dom';
import styled from 'styled-components';

// Global styles
export const Button = styled.button`
  background-color: ${({ theme }) => theme.colors.secondary};
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 1.2rem;
  font-size: 0.85rem;
  font-weight: 500;
  transition: background-color 0.3s ease;
  min-width: 60px;
  min-height: 32px;
  text-align: center;
  display: inline-block;
  border: none;
  box-shadow: none;

  &:hover {
    background-color: ${({ theme }) => theme.colors.accent};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 700px) {
    width: 90%;
    font-size: 0.9rem;
    min-height: 36px;
    padding: 0.5rem 0;
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
  font-size: 1.7rem;
  text-align: center;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.primary};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1.3rem;
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
  background-color: #333;
  padding: 0.7rem 1.2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 1000;
  box-sizing: border-box;

  @media (max-width: 700px) {
    flex-direction: column;
    gap: 0.7rem;
    padding: 0.7rem 0.5rem;
  }
`;

export const HeaderText = styled.p`
  color: white;
  margin: 0;
  font-size: 0.95rem;
  flex: 1;

  @media (max-width: 700px) {
    text-align: center;
    font-size: 0.9rem;
    margin-bottom: 0.3rem;
  }
`;

export const HeaderTitle = styled.h1`
    font-size: 1.3rem;
    font-weight: bold;
    margin: 0;
    white-space: nowrap;
`;

export const HeaderButtonDiv = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;

  @media (max-width: 700px) {
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }
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
    font-size: 0.9rem;
    margin: 0;
    font-weight: normal;
`;

export const FooterLink = styled.a`
    color: #fff;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    img {
        width: 100px;
        height: auto;
        display: block;
        @media (max-width: 700px) {
            width: 70px;
        }
    }
`;

// Homepage styles




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
    font-size: 1.7rem;
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

export const PasswordInputContainer = styled.div`
    position: relative;
    width: 300px;
    margin: 10px 0;
`;

export const TogglePasswordButton = styled.button`
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #666;
    cursor: pointer;
    font-size: 0.9em;
    padding: 0;
    
    &:hover {
        color: #333;
    }
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
  direction: rtl;
  text-align: right;
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
  @media (max-width: 700px) {
    padding: 1rem 0.2rem;
  }
`;

export const ProfileSection = styled.section`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
  padding: 2rem;
  margin-bottom: 2rem;
  direction: rtl;
  text-align: right;
  @media (max-width: 700px) {
    padding: 1rem;
  }
`;

export const ProfileTitle = styled.h2`
  font-size: 1.3rem;
  margin-bottom: 1rem;
  font-weight: bold;

  @media (max-width: 700px) {
    font-size: 1.1rem;
  }
`;

export const Info = styled.p`
    font-size: 0.9rem;
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

  @media (max-width: 700px) {
    width: 100%;
    padding: 0.7rem 0;
    font-size: 1rem;
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

// Trainer Profile styles
export const TrainerDashboardContainer = styled(DashboardContainer)`
    max-width: 1200px;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
`;

export const TrainerHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  background: linear-gradient(135deg, rgb(209, 205, 236) 0%, rgb(209, 205, 236) 100%);
  padding: 2rem;
  border-radius: 20px;
  color: white;
  margin-bottom: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

  @media (max-width: 700px) {
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    gap: 1rem;
    text-align: center;
  }
`;

export const TrainerImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 4px solid white;
  object-fit: cover;

  @media (max-width: 700px) {
    width: 90px;
    height: 90px;
  }
`;

export const TrainerInfo = styled.div`
  text-align: right;
  flex: 1;

  @media (max-width: 700px) {
    text-align: center;
    width: 100%;
  }
`;

export const TrainerName = styled.h1`
  margin: 0;
  font-size: 2.2rem;
  font-weight: 700;

  @media (max-width: 700px) {
    font-size: 1.5rem;
  }
`;

export const TrainerTitle = styled.h2`
  margin: 0.5rem 0;
  font-size: 1.3rem;
  font-weight: 500;
  opacity: 0.9;

  @media (max-width: 700px) {
    font-size: 1rem;
  }
`;

export const TrainerGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
`;

export const EnhancedProfileSection = styled(ProfileSection)`
    background: white;
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    
    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }
`;

export const EnhancedProfileTitle = styled(ProfileTitle)`
    color: #6c5ce7;
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

export const EnhancedInfo = styled.div`
  font-size: 0.95rem;
  margin-bottom: 0.3rem;

  @media (max-width: 700px) {
    font-size: 0.85rem;
  }
`;

export const TrainerStatus = styled.div`
  margin-top: 15px;
  padding: 12px 16px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1rem;
  text-align: right;
  display: flex;
  align-items: center;
  gap: 8px;

  background-color: ${({ status }) =>
    status === 'approved' ? '#d4edda' :
    status === 'rejected' ? '#f8d7da' :
    '#fff3cd'};

  color: ${({ status }) =>
    status === 'approved' ? '#155724' :
    status === 'rejected' ? '#721c24' :
    '#856404'};

  border: 1px solid
    ${({ status }) =>
      status === 'approved' ? '#c3e6cb' :
      status === 'rejected' ? '#f5c6cb' :
      '#ffeeba'};

  &::before {
    content: ${({ status }) =>
      status === 'approved' ? '"✅"' :
      status === 'rejected' ? '"❌"' :
      '"🔔"'};
    font-size: 1.2rem;
  }
`;

export const ContactAdminButton = styled.button`
  margin-top: 10px;
  background-color: #6c5ce7;
  color: white;
  border: none;
  padding: 8px 16px;
  font-size: 0.9rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #5a4cd6;
  }
`;


