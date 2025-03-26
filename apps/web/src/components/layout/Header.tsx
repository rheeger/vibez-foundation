import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import ProfileAvatar from '../profile/ProfileAvatar';

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
  cursor: pointer;
`;

const Nav = styled.nav`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: center;
`;

const NavLink = styled.a<{ active?: boolean }>`
  color: white;
  font-weight: ${({ active }) => (active ? '700' : '500')};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  transition: all ${({ theme }) => theme.transitions.fast};
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  background-color: ${({ active, theme }) => active ? 'rgba(255, 255, 255, 0.25)' : 'transparent'};
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.25);
    transform: translateY(-2px);
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const LoginButton = styled.a`
  color: white;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.5);
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-weight: 500;
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: pointer;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
  }
`;

const SignupButton = styled.a`
  color: ${({ theme }) => theme.colors.primary.dark};
  background-color: white;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-weight: 600;
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const UserMenu = styled.div`
  position: relative;
`;

const UserMenuTrigger = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: 50%;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.15);
  }
`;

const UserMenuDropdown = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background-color: white;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.sm} 0;
  min-width: 200px;
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
  transform: translateY(${({ isOpen }) => (isOpen ? '0' : '-10px')});
  transition: all ${({ theme }) => theme.transitions.fast};
  z-index: 100;
  
  &:before {
    content: '';
    position: absolute;
    top: -8px;
    right: 16px;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid white;
  }
`;

const UserMenuItem = styled.a`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.fontSizes.small};
  transition: background-color ${({ theme }) => theme.transitions.fast};
  cursor: pointer;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.background.light};
  }
`;

const UserMenuDivider = styled.div`
  height: 1px;
  margin: ${({ theme }) => theme.spacing.xs} 0;
  background-color: ${({ theme }) => theme.colors.border};
`;

const UserName = styled.span`
  color: white;
  font-size: ${({ theme }) => theme.fontSizes.small};
  margin-right: ${({ theme }) => theme.spacing.sm};
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
`;

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef]);
  
  const isActive = (path: string) => {
    return router.pathname === path;
  };
  
  return (
    <HeaderContainer>
      <Link href="/" passHref>
        <Logo>🏝️ VIBEZ</Logo>
      </Link>
      <Nav>
        <Link href="/" passHref legacyBehavior>
          <NavLink active={isActive('/')}>Home</NavLink>
        </Link>
        
        {isAuthenticated && (
          <Link href="/dashboard" passHref legacyBehavior>
            <NavLink active={isActive('/dashboard')}>Dashboard</NavLink>
          </Link>
        )}
        
        <Link href="/funds" passHref legacyBehavior>
          <NavLink active={isActive('/funds')}>Funds</NavLink>
        </Link>
        
        <Link href="/organizations" passHref legacyBehavior>
          <NavLink active={isActive('/organizations')}>Organizations</NavLink>
        </Link>
        
        <Link href="/about" passHref legacyBehavior>
          <NavLink active={isActive('/about')}>About</NavLink>
        </Link>
        
        {isAuthenticated ? (
          <UserMenu ref={menuRef}>
            <UserMenuTrigger onClick={toggleMenu}>
              <UserName>{user?.name?.split(' ')[0]}</UserName>
              <ProfileAvatar size="small" />
            </UserMenuTrigger>
            
            <UserMenuDropdown isOpen={menuOpen}>
              <Link href="/profile" passHref legacyBehavior>
                <UserMenuItem onClick={() => setMenuOpen(false)}>
                  My Profile
                </UserMenuItem>
              </Link>
              
              <Link href="/dashboard" passHref legacyBehavior>
                <UserMenuItem onClick={() => setMenuOpen(false)}>
                  Dashboard
                </UserMenuItem>
              </Link>
              
              <Link href="/funds/my-funds" passHref legacyBehavior>
                <UserMenuItem onClick={() => setMenuOpen(false)}>
                  My Funds
                </UserMenuItem>
              </Link>
              
              <UserMenuDivider />
              
              <UserMenuItem onClick={() => {
                setMenuOpen(false);
                logout();
              }}>
                Sign Out
              </UserMenuItem>
            </UserMenuDropdown>
          </UserMenu>
        ) : (
          <AuthButtons>
            <Link href="/auth/login" passHref legacyBehavior>
              <LoginButton>Log In</LoginButton>
            </Link>
            <Link href="/auth/register" passHref legacyBehavior>
              <SignupButton>Sign Up</SignupButton>
            </Link>
          </AuthButtons>
        )}
      </Nav>
    </HeaderContainer>
  );
};

export default Header; 