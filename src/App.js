import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import './App.css';
import { findMetaMaskAccount } from 'helpers/main';

const App = () => {
  const [currentAccount, setCurrentAccount] = useState('');

  useEffect(() => {
    (async () => {
      const account = await findMetaMaskAccount();
      if (account !== null) {
        setCurrentAccount(account);
      }
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

        <button className="waveButton" onClick={null}>
          Wave at Me
        </button>
      </div>
    </div>
  );
};

export default App;
