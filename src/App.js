import React from 'react';
import './App.css';
import { connectWallet, wave } from 'helpers/main';
import { SpinnerCircular } from 'spinners-react';
import PopupMessage from 'components/PopupMessage/PopupMessage';
import { useApp } from 'useApp';

const App = () => {
  const {
    currentAccount,
    waveCount,
    allWaves,
    txn,
    isMining,
    message,
    popupMessage,
    hasMetamask,
    handleSetCurrentAccount,
    handleSetTxn,
    handleSetWaveCount,
    handleSetIsMining,
    handleSetMessage,
    dispatchPopupMessage,
    resetMessage,
  } = useApp();
  const onWave = () => {
    wave({
      handleSetTxn,
      handleSetIsMining,
      message,
      dispatchPopupMessage,
      handleSetWaveCount,
      resetMessage,
    });
  };

  return (
    <>
      {popupMessage ? <PopupMessage popupMessage={popupMessage} /> : null}
      <div className="mainContainer">
        <div className="dataContainer">
          <div className="header">
            <h1>GM!</h1>
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

          {hasMetamask ? (
            <>
              <div className="waveCountContainer">
                {waveCount !== null ? (
                  <>
                    <span className="description">Total waves:</span>
                    {isMining ? (
                      <SpinnerCircular color="#48dcb0" size={72} />
                    ) : (
                      <div className="wavesValueContainer">
                        <span className="wavesValue">{waveCount}</span>
                        <span
                          className="handWaveEmoji"
                          role="img"
                          aria-label="waving hand"
                        >
                          👋
                        </span>
                      </div>
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
                      onChange={(event) => handleSetMessage(event.target.value)}
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
                      <span className="description">
                        Your transaction hash:
                      </span>
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
            </>
          ) : (
            <div className="noMetamask">
              Please get Metamask to use the app
              <a href="https://metamask.io/" target="blank">
                <img
                  src={require('assets/img/metamask_fox.webp')}
                  alt="metamask logo"
                />
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default App;
