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
  const [message, setMessage] = useState('');

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

  const onWave = () => {
    wave({
      handleSetWaveCount,
      handleSetAllWaves,
      handleSetTxn,
      handleSetIsMining,
      message,
    });
    setMessage('');
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
          GM
          <span role="img" aria-label="waving hand">
            👋
          </span>
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
                <SpinnerCircular color="#48dcb0" size={72} />
              ) : (
                <span className="wavesValue">{waveCount}</span>
              )}
            </>
          ) : null}
        </div>

        <div className="waverContainer">
          {currentAccount ? (
            <>
              <input
                className="inputMessage"
                rows="5"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Type your message here - up to 140 characters ;-)"
                maxLength={140}
              />
              <button
                className={['button', 'waveButton'].join(' ')}
                onClick={onWave}
              >
                Wave at Me
              </button>
            </>
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

        <div className="horizontalLine" />

        <div className="waveMessagesContainer">
          <h2 className="waveMessagesTitle">Your Waves</h2>
          {allWaves?.map((wave, index) => {
            return (
              <div className="waveMessage" key={index + wave.address}>
                <div className="messageDetails">
                  <span className="address">{wave.address}</span>
                  <span className="time">
                    {wave.timestamp.toString().slice(0, 34)}
                  </span>
                </div>
                <div className="message">
                  <p>{wave.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default App;
