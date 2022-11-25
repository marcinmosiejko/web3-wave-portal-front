import React, { useEffect, useState } from 'react';
import './App.css';
import {
  findMetaMaskAccount,
  connectWallet,
  wave,
  readWaveCount,
} from 'helpers/main';
import { SpinnerCircular } from 'spinners-react';

const App = () => {
  const [currentAccount, setCurrentAccount] = useState('');
  const [waveCount, setWaveCount] = useState('');
  const [txn, setTxn] = useState('');
  const [isMining, setIsMining] = useState(false);

  const handleSetCurrentAccount = (account) => {
    setCurrentAccount(account);
  };

  const handleSetWaveCount = (count) => {
    setWaveCount(count);
  };

  const handleSetTxn = (txn) => {
    setTxn(txn);
  };

  const handleSetIsMining = (isMining) => {
    setIsMining(isMining);
  };

  useEffect(() => {
    (async () => {
      const account = await findMetaMaskAccount();
      if (account !== null) {
        setCurrentAccount(account);
      }
      readWaveCount(handleSetWaveCount);
    })();
  }, []);

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">GM 👋</div>

        <div className="bio">
          <p>
            My name's Marcin. I'm a video editor working towards becoming web3
            developer ;)
          </p>
          <p> Connect your Ethereum wallet and wave at me!</p>
        </div>

        <div className="totalWavesContainer">
          {waveCount ? (
            <>
              <span className="description">Total waves:</span>
              {isMining ? (
                <SpinnerCircular color="#48dcb0" size={48} />
              ) : (
                <span className="wavesValue">{waveCount}</span>
              )}
            </>
          ) : null}
        </div>

        {currentAccount ? (
          <button
            className={['button', 'waveButton'].join(' ')}
            onClick={() =>
              wave(handleSetWaveCount, handleSetTxn, handleSetIsMining)
            }
          >
            Wave at Me
          </button>
        ) : (
          <button
            className={['button', 'connectWalletButton'].join(' ')}
            onClick={() => connectWallet(handleSetCurrentAccount)}
          >
            Connect Wallet
          </button>
        )}

        <div className="txnContainer">
          {txn ? (
            <>
              <span className="description">Your transaction hash:</span>
              <span className="txnValue"> {txn}</span>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default App;
