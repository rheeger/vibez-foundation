import type { AppProps } from 'next/app';
import { ThemeProvider } from 'styled-components';
import { QueryClient, QueryClientProvider } from 'react-query';
import { GlobalStyle } from '@/styles/GlobalStyle';
import { theme } from '@/styles/theme';
import { AnimationProvider } from '@/contexts/AnimationContext';
import { SoundProvider } from '@/contexts/SoundContext';
import Layout from '@/components/layout/Layout';

// Create a client for react-query
const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <AnimationProvider>
          <SoundProvider>
            <GlobalStyle />
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </SoundProvider>
        </AnimationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
} 