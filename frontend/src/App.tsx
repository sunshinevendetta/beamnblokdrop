import React from 'react';
import WalletConnector from './WalletConnector';
import SubmitScore from './SubmitScore';

const App: React.FC = () => {
  return (
    <div>
      <h1>BEAMN Arcade</h1>
      <WalletConnector />
      <SubmitScore />
    </div>
  );
};

export default App;