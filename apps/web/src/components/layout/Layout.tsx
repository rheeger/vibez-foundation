import React from 'react';
import styled from 'styled-components';
import Header from './Header';
import Footer from './Footer';
import WaterRippleBackground from '../effects/WaterRippleBackground';

type LayoutProps = {
  children: React.ReactNode;
};

const Main = styled.main`
  flex: 1;
  padding: ${({ theme }) => `0 ${theme.spacing.md}`};
  margin: ${({ theme }) => `${theme.spacing.md} 0`};
  overflow-y: auto;
`;

const LayoutContainer = styled.div`
  position: relative;
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
  height: 100%;
`;

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <WaterRippleBackground color="#00BFFF">
      <LayoutContainer>
        <ContentWrapper>
          <Header />
          <Main>{children}</Main>
          <Footer />
        </ContentWrapper>
      </LayoutContainer>
    </WaterRippleBackground>
  );
};

export default Layout; 