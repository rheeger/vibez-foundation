import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

const FooterContainer = styled.footer`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing.lg} ${theme.spacing.xl}`};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  height: 80px;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const FooterLink = styled.a`
  color: white;
  font-weight: 500;
  transition: opacity ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    opacity: 0.8;
  }
`;

const Copyright = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.small};
  opacity: 0.8;
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