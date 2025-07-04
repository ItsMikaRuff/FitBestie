//SmartChatBot.jsx

import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import dumbbellIcon from '../Images/dumbbell.png';
import TypingIndicator from './TypingIndicator';

const ping = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.25); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

const BubbleButton = styled.button`
  position: fixed;
  bottom: 30px;
  left: 30px;
  width: 55px;
  height: 55px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f8bbd0 80%, #fdf6fa 100%);
  box-shadow: 0 3px 12px rgba(236, 72, 153, 0.10);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: #ec4899;
  cursor: pointer;
  z-index: 10000;
  transition: background 0.2s, box-shadow 0.22s;
  outline: none;
`;

const NotifyBadge = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #ec4899;
  border: 2px solid #fff;
  color: #fff;
  font-size: 12px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${ping} 0.7s;
  box-shadow: 0 0 4px #ec48997a;
`;

const IconContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BubbleIconImg = styled.img`
  width: 28px;
  height: 28px;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px #f8bbd0cc);
`;

const ChatWrapper = styled.div`
  position: fixed;
  bottom: 24px;
  left: 24px;
  z-index: 9999;
`;

const ChatWindow = styled.div`
  width: 355px;
  max-width: 99vw;
  max-height: 80vh;
  left:24px;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 32px rgba(236, 72, 153, 0.16);
  display: flex;
  flex-direction: column;
  font-family: inherit;
  overflow: hidden;
  position: absolute;
  bottom: 70px;

  @media (max-width: 500px) {
    width: 77vw;
  }
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 13px;
  left: 13px;
  background: transparent;
  border: none;
  font-size: 22px;
  color: #f43f5e;
  cursor: pointer;
  padding: 0;
  z-index: 2;
`;

const ChatBody = styled.div`
  flex: 1;
  min-height: 180px;
  max-height: 330px;
  overflow-y: auto;
  padding: 24px 12px 8px 12px;
  background: #fff6fa;
  display: flex;
  flex-direction: column;
  gap: 8px;
  scroll-behavior: smooth;
`;

const ChatMsgRow = styled.div`
  display: flex;
  justify-content: ${({ $user }) => ($user ? 'flex-start' : 'flex-end')};
`;

const ChatMsg = styled.div`
  background: ${({ $user }) => ($user ? '#fbcfe8' : '#ffe6e6')};
  color: ${({ $user }) => ($user ? '#42264b' : '#be326e')};
  padding: 10px 14px;
  border-radius: 17px;
  max-width: 86%;
  font-size: 1rem;
  text-align: right;
  direction: rtl;
  font-family: inherit;
  box-shadow: 0 2px 10px rgba(236, 72, 153, 0.08);
  word-break: break-word;
  line-height: 1.7;
  border-bottom-${({ $user }) => ($user ? 'left' : 'right')}-radius: 3px;
  display: inline-block;
`;

const NameLabel = styled.span`
  font-size: 0.95em;
  font-weight: bold;
  color: ${({ $user }) => ($user ? '#883377' : '#b41750')};
  display: block;
  margin-bottom: 6px;
`;

const ChatInputRow = styled.div`
  display: flex;
  gap: 8px;
  padding: 15px 12px;
  border-top: 1px solid #eee;
  background: #fff;
`;

const Input = styled.input`
  border: 1px solid #e5e7eb;
  padding: 10px 13px;
  border-radius: 10px;
  flex: 1;
  font-family: inherit;
  font-size: 1rem;
  outline: none;
  background: #fff9fb;
  box-shadow: 0 2px 5px #fbcfe820;
`;

const SendBtn = styled.button`
  background: #f8bbd0;
  color: #ec4899;
  padding: 8px 16px;
  border-radius: 9px;
  border: none;
  font-weight: bold;
  font-family: inherit;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.13s;
  &:disabled {
    background: #eee;
    color: #c1c1c1;
    cursor: not-allowed;
  }
`;

const SmartChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [notify, setNotify] = useState(false);
  const lastMsgRef = useRef(null);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (open && lastMsgRef.current) {
      lastMsgRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open, loading]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    if (open && notify) setNotify(false);
  }, [open, notify]);

  const handleInputSend = () => {
    if (!input.trim() || loading) return;
    setMessages((prev) => [...prev, { sender: 'user', text: input }]);
    sendMessage(input);
    setInput('');
  };

  const sendMessage = async (userMessage) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${API_URL}/api/chatbot`,
        { message: userMessage },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setMessages(prev => [...prev, { sender: 'bot', text: data.answer }]);
      if (!open) setNotify(true);
    } catch {
      setMessages(prev => [...prev, { sender: 'bot', text: 'שגיאה בשליחת השאלה' }]);
      if (!open) setNotify(true);
    }
    setLoading(false);
  };

  const formatBotResponse = (text) => {
    const lines = text.split(/\n+/).filter(Boolean);
    const formatted = lines.map((line, i) => {
      if (/^###\s?/.test(line)) {
        return <h4 key={i} style={{ margin: '8px 0 4px', color: '#9b2146' }}>{line.replace(/^###\s?/, '')}</h4>;
      }
      const boldPattern = /\*\*(.*?)\*\*/g;
      const cleaned = line.replace(boldPattern, (_, inner) => `<strong>${inner}</strong>`);
      return <p key={i} style={{ margin: '4px 0' }} dangerouslySetInnerHTML={{ __html: cleaned }} />;
    });

    return <div style={{ paddingRight: '1rem', textAlign: 'right', direction: 'rtl' }}>{formatted}</div>;
  };

  return (
    <ChatWrapper>
      <BubbleButton onClick={() => setOpen(!open)} title="יועצת כושר & תזונה">
        <IconContainer>
          <BubbleIconImg src={dumbbellIcon} alt="אייקון משקולת" />
          {notify && <NotifyBadge>!</NotifyBadge>}
        </IconContainer>
      </BubbleButton>
      {open && (
        <ChatWindow dir="ltr">
          <CloseBtn onClick={() => setOpen(false)} title="סגירה">×</CloseBtn>
          <ChatBody>
            {messages.map((msg, i) => (
              <ChatMsgRow $user={msg.sender !== 'user'} key={i}>
                <ChatMsg
                  $user={msg.sender !== 'user'}
                  ref={i === messages.length - 1 ? lastMsgRef : undefined}
                >
                  <NameLabel $user={msg.sender !== 'user'}>
                    {msg.sender === 'user' ? 'את:' : 'מאמנת:'}
                  </NameLabel>
                  {msg.sender === 'bot' ? formatBotResponse(msg.text) : msg.text}
                </ChatMsg>
              </ChatMsgRow>
            ))}
            {loading && <TypingIndicator />}
          </ChatBody>
          <ChatInputRow>
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleInputSend();
              }}
              placeholder="שאלי אותי כל דבר על כושר או תזונה..."
              dir="rtl"
              disabled={loading}
              autoFocus
            />
            <SendBtn
              onClick={handleInputSend}
              disabled={loading || !input.trim()}>
              שלחי
            </SendBtn>
          </ChatInputRow>
        </ChatWindow>
      )}
    </ChatWrapper>
  );
};

export default SmartChatBot;
