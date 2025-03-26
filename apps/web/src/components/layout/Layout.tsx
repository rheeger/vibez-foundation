import React from 'react';
import styled from 'styled-components';
import Header from './Header';
import Footer from './Footer';

type LayoutProps = {
  children: React.ReactNode;
};

const Main = styled.main`
  min-height: calc(100vh - 160px); // Adjust based on header/footer height
  padding: ${({ theme }) => theme.spacing.lg} 0;
`;

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <Main>{children}</Main>
      <Footer />
    </>
  );
};

export default Layout; 