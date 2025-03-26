import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.xl}`};
  background-color: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  height: 80px;
  margin: 0;
  border-radius: 0 0 ${({ theme }) => theme.borderRadius.large} ${({ theme }) => theme.borderRadius.large};
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-top: none;
  z-index: 100;
`;

const Logo = styled.div`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const Nav = styled.nav`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const NavLink = styled.a`
  color: white;
  font-weight: 500;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  transition: all ${({ theme }) => theme.transitions.fast};
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.25);
    transform: translateY(-2px);
  }
`;

const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <Logo>🏝️ VIBEZ</Logo>
      <Nav>
        <Link href="/" passHref legacyBehavior>
          <NavLink>Home</NavLink>
        </Link>
        <Link href="/funds" passHref legacyBehavior>
          <NavLink>Funds</NavLink>
        </Link>
        <Link href="/organizations" passHref legacyBehavior>
          <NavLink>Organizations</NavLink>
        </Link>
        <Link href="/about" passHref legacyBehavior>
          <NavLink>About</NavLink>
        </Link>
      </Nav>
    </HeaderContainer>
  );
};

export default Header; 