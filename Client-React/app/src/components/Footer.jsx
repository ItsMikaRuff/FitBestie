import React from 'react';
import { useTheme } from '../context/ThemeContext'; // נתיב של ThemeContext
import { FooterStyle, FooterText, FooterLink } from './styledComponents';

const Footer = () => {
    return (
        <FooterStyle>
            <FooterText>© 2025 FIT-BESTIE. All rights reserved.</FooterText>
            <FooterText>
                Chat with us on WhatsApp
                <FooterLink href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer"> here</FooterLink>
            </FooterText>

            <FooterText>
                Follow us on Instagram
                <FooterLink href="https://www.instagram.com/yourprofile" target="_blank" rel="noopener noreferrer"> here</FooterLink>
            </FooterText>
        </FooterStyle>
    );
};

export default Footer;
