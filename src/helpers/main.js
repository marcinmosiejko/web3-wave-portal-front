import { ethers } from 'ethers';
import abi from 'utils/WavePortal.json';
import { defaultError, successWave } from './popupMessages';

const contractAddress = '0x75f8F563CaE3cDB292f0AA8A3f5ba91f221F4b62';
const contractABI = abi.abi;

const getEthereumObject = () => window.ethereum;

const getCleanWaves = (waves) => {
  // We only need address, timestamp, and message in our UI
  const wavesCleaned = [];
  waves.forEach((wave) => {
    wavesCleaned.push({
      address: wave.waver || wave.from,
      timestamp: new Date(wave.timestamp * 1000),
      message: wave.message,
    });
  });

  return wavesCleaned.reverse();
};

// This function returns the first linked account found.
// If there is no account linked, it will return null.
export const findMetaMaskAccount = async () => {
  try {
    const ethereum = getEthereumObject();

    // First make sure we have access to the Ethereum object
    if (!ethereum) {
      console.error('Make sure you have Metamask!');
      return null;
    }

    console.log('We have the Ethereum object', ethereum);
    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log('Found an authorized account:', account);
      return account;
    } else {
      console.error('No authorized account found');
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const connectWallet = async (handleSetCurrentAccount) => {
  try {
    const ethereum = getEthereumObject();
    if (!ethereum) {
      alert('Get MetaMask!');
      return;
    }

    // Requests Metamask to give access to the user's wallet
    const accounts = await ethereum.request({
      method: 'eth_requestAccounts',
    });

    console.log('Connected', accounts[0]);
    handleSetCurrentAccount(accounts[0]);
  } catch (error) {
    console.error(error);
  }
};

export const getAllWaves = async (handleSetAllWaves) => {
  try {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const wavePortalContract = new ethers.Contract(
        contractAddress,
        contractABI,
        provider
      );

      const waves = await wavePortalContract.getAllWaves();
      handleSetAllWaves(getCleanWaves(waves));
    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log(error);
  }
};

export const wave = async ({
  handleSetTxn,
  handleSetIsMining,
  message,
  dispatchPopupMessage,
}) => {
  try {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const wavePortalContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      // Execute the actual wave from smart contract and get transaction hash
      // Add gas limit, as Metamask will try to estimate how much gas a transaction will use, but sometimes it's wrong. Estimating gas is a hard problem and an easy workaround for this (so users don't get angry when a transaction fails) is to set a limit
      const waveTxn = await wavePortalContract.wave(message, {
        gasLimit: 300000,
      });
      handleSetTxn(waveTxn.hash);

      // Wait for the transaction to get mined
      handleSetIsMining(true);
      await waveTxn.wait();
      dispatchPopupMessage(successWave);
      handleSetIsMining(false);
    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log(error);
    handleSetIsMining(false);
    dispatchPopupMessage(defaultError);
  }
};

export const listenForEvents = (addNewWaveToAllWaves) => {
  let wavePortalContract;

  const onNewWave = (from, timestamp, message) => {
    addNewWaveToAllWaves(getCleanWaves([{ from, timestamp, message }]).at(0));
  };

  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    wavePortalContract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );
    wavePortalContract.on('NewWave', onNewWave);
  }

  return { wavePortalContract, onNewWave };
};
