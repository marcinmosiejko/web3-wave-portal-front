import { ethers } from 'ethers';
import abi from 'utils/WavePortal.json';

const contractAddress = '0x021247df66b1406c13297F8A0eB1EAc42E6ebd61';
const contractABI = abi.abi;

const getEthereumObject = () => window.ethereum;

const getCleanWaves = (waves) => {
  // We only need address, timestamp, and message in our UI
  const wavesCleaned = [];
  waves.forEach((wave) => {
    wavesCleaned.push({
      address: wave.waver,
      timestamp: new Date(wave.timestamp * 1000),
      message: wave.message,
    });
  });

  return wavesCleaned;
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

export const getWaveCount = async (handleSetWaveCount) => {
  try {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const wavePortalContract = new ethers.Contract(
        contractAddress,
        contractABI,
        provider
      );

      // Read from contract
      const count = await wavePortalContract.getTotalWaves();
      handleSetWaveCount(count.toNumber());
    }
  } catch (err) {}
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
  handleSetWaveCount,
  handleSetTxn,
  handleSetIsMining,
  handleSetAllWaves,
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
      const waveTxn = await wavePortalContract.wave('this is a message');
      handleSetTxn(waveTxn.hash);
      handleSetIsMining(true);

      // Wait for the transaction to get mined
      await waveTxn.wait();
      handleSetIsMining(false);

      // Read from contract again to update displayed data
      const count = await wavePortalContract.getTotalWaves();
      const allWaves = await wavePortalContract.getAllWaves();
      handleSetWaveCount(count.toNumber());
      handleSetAllWaves(getCleanWaves(allWaves));
    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log(error);
  }
};
