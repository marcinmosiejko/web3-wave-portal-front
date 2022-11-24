import React, { useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';

const getEthereumObject = () => window.ethereum;
const App = () => {
  useEffect(() => {
    const ethereum = getEthereumObject();
    if (!ethereum) {
      console.log('Make sure you have metamask!');
    } else {
      console.log('We have the ethereum object', ethereum);
    }
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
