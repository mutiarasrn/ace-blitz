import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { monadTestnet } from './monad';

export const config = getDefaultConfig({
  appName: 'ACE-Blitz',
  projectId: 'a5c0b1712aebdb817fa1d615bd052608', // Placeholder WalletConnect ID
  chains: [monadTestnet],
  ssr: true,
});
