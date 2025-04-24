'use client';

import { ReactNode } from 'react';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '@rainbow-me/rainbowkit/styles.css';
 
import theme from '@/components/ui/theme';
import createEmotionCache from "@/lib/createEmotionCache";
import { config } from '@/lib/wagmi';

const emotionCache = createEmotionCache();
const queryClient = new QueryClient()

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider coolMode>
              {children}
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}