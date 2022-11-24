import * as React from 'react';
import { ethers } from 'ethers';
import './App.css';

export default function App() {
  const wave = () => {};

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

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>
      </div>
    </div>
  );
}
