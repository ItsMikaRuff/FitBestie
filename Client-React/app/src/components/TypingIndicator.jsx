import styled, { keyframes } from "styled-components";

const bounce = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
  } 
  40% {
    transform: scale(1);
  }
`;

const DotContainer = styled.div`
  display: flex;
  gap: 4px;
  margin-top: 10px;
  padding: 4px;
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  background-color: #ffb6c1;
  border-radius: 50%;
  animation: ${bounce} 1.4s infinite;
  &:nth-child(2) {
    animation-delay: 0.2s;
  }
  &:nth-child(3) {
    animation-delay: 0.4s;
  }
`;

export default function TypingIndicator() {
    return (
        <DotContainer>
            <Dot />
            <Dot />
            <Dot />
        </DotContainer>
    );
}
