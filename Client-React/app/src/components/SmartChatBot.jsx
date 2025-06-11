import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import dumbbellIcon from '../Images/dumbbell.png'; // ← הנתיב שלך

const ping = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.25); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

const BubbleButton = styled.button`
  position: fixed;
  bottom: 24px;
  left: 24px;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f8bbd0 80%, #fdf6fa 100%);
  border: 2.5px solid #f6c1d6;
  box-shadow: 0 3px 12px rgba(236, 72, 153, 0.10);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: #ec4899;
  cursor: pointer;
  z-index: 9999;
  transition: background 0.2s, box-shadow 0.22s;
  outline: none;

  &:hover {
    background: linear-gradient(135deg, #fbcfe8 90%, #fdf6fa 100%);
    box-shadow: 0 6px 24px rgba(236, 72, 153, 0.18);
  }
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

// ... כל שאר styled-components כמו קודם (ChatWindow, CloseBtn וכו')

const ChatWindow = styled.div`
  position: fixed;
  bottom: 24px;
  left: 24px;
  width: 345px;
  max-width: 96vw;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 32px rgba(236, 72, 153, 0.16);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  font-family: inherit;
  overflow: hidden;
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
  height: 255px;
  overflow-y: auto;
  padding: 26px 16px 0 16px;
  flex: 1;
  background: #fff0fa18;
`;

const ChatMsg = styled.div`
  text-align: ${({ user }) => (user ? 'right' : 'left')};
  margin-bottom: 10px;
  direction: rtl;
  font-family: inherit;
  color: ${({ user }) => (user ? '#444' : '#d72660')};
`;

const ChatInputRow = styled.div`
  display: flex;
  gap: 8px;
  padding: 16px;
  border-top: 1px solid #eee;
  background: #fff;
`;

const Input = styled.input`
  border: 1px solid #e5e7eb;
  padding: 9px 12px;
  border-radius: 9px;
  flex: 1;
  font-family: inherit;
  font-size: 1rem;
  outline: none;
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

    const sendMessage = async () => {
        if (!input.trim()) return;
        setLoading(true);
        setMessages([...messages, { sender: 'user', text: input }]);
        try {
            const { data } = await axios.post('/api/chatbot', { message: input });
            setMessages(prev => [...prev, { sender: 'bot', text: data.answer }]);
            if (!open) setNotify(true);
        } catch {
            setMessages(prev => [...prev, { sender: 'bot', text: 'שגיאה בשליחת השאלה' }]);
            if (!open) setNotify(true);
        }
        setInput('');
        setLoading(false);
    };

    // סגירה ע"י ESC
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === 'Escape' && setOpen(false);
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open]);

    // חיווי הודעה חדשה - מתאפס כשפותחים
    useEffect(() => {
        if (open && notify) setNotify(false);
    }, [open, notify]);

    // גלילה להודעה האחרונה בצ'אט
    useEffect(() => {
        if (open && lastMsgRef.current)
            lastMsgRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [messages, open]);

    return (
        <>
            {!open && (
                <BubbleButton onClick={() => setOpen(true)} title="יועצת כושר & תזונה">
                    <IconContainer>
                        <BubbleIconImg src={dumbbellIcon} alt="אייקון משקולת" />
                        {notify && <NotifyBadge>!</NotifyBadge>}
                    </IconContainer>
                </BubbleButton>
            )}
            {open && (
                <ChatWindow dir="rtl">
                    <CloseBtn onClick={() => setOpen(false)} title="סגירה">×</CloseBtn>
                    <ChatBody>
                        {messages.map((msg, i) => (
                            <ChatMsg
                                user={msg.sender === 'user'}
                                key={i}
                                ref={i === messages.length - 1 ? lastMsgRef : undefined}
                            >
                                <b>{msg.sender === 'user' ? 'את' : 'מאמנת'}</b>: {msg.text}
                            </ChatMsg>
                        ))}
                        {loading && <div>טוען...</div>}
                    </ChatBody>
                    <ChatInputRow>
                        <Input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && sendMessage()}
                            placeholder="שאלי אותי כל דבר על כושר או תזונה..."
                            dir="rtl"
                        />
                        <SendBtn
                            onClick={sendMessage}
                            disabled={loading || !input.trim()}>
                            שלחי
                        </SendBtn>
                    </ChatInputRow>
                </ChatWindow>
            )}
        </>
    );
};

export default SmartChatBot;
