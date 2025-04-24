import { http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

export const chains = [mainnet, sepolia] as const;

export const config = getDefaultConfig({
  appName: 'Ceres Farm',
  projectId,
  chains,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})
