import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

const FooterContainer = styled.footer`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.xl}`};
  background-color: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.1);
  color: white;
  min-height: 60px;
  margin: 0;
  border-radius: ${({ theme }) => theme.borderRadius.large} ${({ theme }) => theme.borderRadius.large} 0 0;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-bottom: none;
  z-index: 100;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const FooterLink = styled.a`
  color: white;
  font-weight: 500;
  transition: all ${({ theme }) => theme.transitions.fast};
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  
  &:hover {
    opacity: 0.8;
    transform: translateY(-2px);
  }
`;

const Copyright = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.small};
  opacity: 0.8;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterLinks>
        <Link href="/terms" passHref legacyBehavior>
          <FooterLink>Terms</FooterLink>
        </Link>
        <Link href="/privacy" passHref legacyBehavior>
          <FooterLink>Privacy</FooterLink>
        </Link>
        <Link href="/contact" passHref legacyBehavior>
          <FooterLink>Contact</FooterLink>
        </Link>
      </FooterLinks>
      <Copyright>© {new Date().getFullYear()} VIBEZ FOUNDATION. All rights reserved.</Copyright>
    </FooterContainer>
  );
};

export default Footer; 