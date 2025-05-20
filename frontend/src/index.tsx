import React from 'react';
import ReactDOM from 'react-dom/client';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { lensTestnet } from 'wagmi/chains';
import { ConnectKitProvider } from 'connectkit';
import { LensProvider } from '@lens-protocol/react-web';
import WalletConnector from './WalletConnector';
import SubmitScore from './SubmitScore';

const config = createConfig({
  chains: [lensTestnet],
  transports: {
    [lensTestnet.id]: http(process.env.REACT_APP_LENS_RPC_URL),
  },
  walletConnectProjectId: process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID,
});

const renderWithProviders = (component: React.ReactElement, rootElement: HTMLElement) => {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <WagmiProvider config={config}>
      <ConnectKitProvider>
        <LensProvider>
          {component}
        </LensProvider>
      </ConnectKitProvider>
    </WagmiProvider>
  );
};

const walletRoot = document.getElementById('wallet-connector-root');
if (walletRoot) {
  renderWithProviders(<WalletConnector />, walletRoot);
}

const submitScoreRoot = document.getElementById('submit-score-root');
if (submitScoreRoot) {
  renderWithProviders(<SubmitScore />, submitScoreRoot);
}