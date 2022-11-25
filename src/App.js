import React, { useEffect, useState } from 'react';
import './App.css';
import {
  findMetaMaskAccount,
  connectWallet,
  wave,
  getWaveCount,
  getAllWaves,
} from 'helpers/main';
import { SpinnerCircular } from 'spinners-react';

const App = () => {
  const [currentAccount, setCurrentAccount] = useState('');
  const [waveCount, setWaveCount] = useState(null);
  const [allWaves, setAllWaves] = useState(null);
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

  const handleSetAllWaves = (allWaves) => {
    setAllWaves(allWaves);
  };

  useEffect(() => {
    (async () => {
      const account = await findMetaMaskAccount();
      if (account !== null) {
        setCurrentAccount(account);
      }
      getWaveCount(handleSetWaveCount);
      getAllWaves(handleSetAllWaves);
    })();
  }, []);

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          GM <span>👋</span>
        </div>

        <div className="bio">
          <p>
            My name's Marcin. I'm a junior developer that likes to tinker with
            new technologies ;)
          </p>
          <p>
            Connect your Ethereum (Metamask) wallet and wave at me on Goerli
            testnet!
          </p>
        </div>

        <div className="waveCountContainer">
          {waveCount !== null ? (
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
              wave({
                handleSetWaveCount,
                handleSetAllWaves,
                handleSetTxn,
                handleSetIsMining,
              })
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

        <div className="waveMessagesContainer">
          {allWaves?.map((wave, index) => {
            return (
              <div className="waveMessage" key={index + wave.address}>
                <div>Address: {wave.address}</div>
                <div>Time: {wave.timestamp.toString()}</div>
                <div>Message: {wave.message}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default App;
