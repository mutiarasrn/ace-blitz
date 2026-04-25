import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { monadTestnet } from './monad';

export const config = getDefaultConfig({
  appName: 'ACE-Blitz',
  projectId: '6d3e960e153683b5bba12c57cbdddf75',
  chains: [monadTestnet],
  ssr: true,
});
