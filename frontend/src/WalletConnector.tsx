import React from 'react';
import { ConnectKitButton } from 'connectkit';
import { useLogin, useActiveProfile } from '@lens-protocol/react-web';
import { useAccount } from 'wagmi';

const WalletConnector: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { execute: login, loading: loginLoading } = useLogin();
  const { data: profile, loading: profileLoading } = useActiveProfile();

  const handleLogin = async () => {
    if (isConnected && address) {
      try {
        await login({ address });
        console.log('Logged in with Lens!');
      } catch (error) {
        console.error('Lens login failed:', error);
      }
    }
  };

  if (profileLoading) return <p>Loading profile...</p>;
  if (profile) return <p>Logged in as {profile.handle}</p>;

  return (
    <div>
      <ConnectKitButton />
      {isConnected && (
        <button onClick={handleLogin} disabled={loginLoading} style={{ marginLeft: '10px' }}>
          {loginLoading ? 'Logging in...' : 'Login with Lens'}
        </button>
      )}
    </div>
  );
};

export default WalletConnector;