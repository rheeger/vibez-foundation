import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.xl}`};
  background-color: white;
  box-shadow: ${({ theme }) => theme.shadows.small};
  height: 80px;
`;

const Logo = styled.div`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const Nav = styled.nav`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const NavLink = styled.a`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.primary};
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