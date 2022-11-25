import { ethers } from 'ethers';
import abi from 'utils/WavePortal.json';

const contractAddress = '0xe8Fd7649A388151390Aee797FA56428925fF98da';
const contractABI = abi.abi;

const getEthereumObject = () => window.ethereum;

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

export const readWaveCount = async (handleSetWaveCount) => {
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
      let count = await wavePortalContract.getTotalWaves();
      handleSetWaveCount(count.toNumber());
    }
  } catch (err) {}
};

export const wave = async (
  handleSetWaveCount,
  handleSetTxn,
  handleSetIsMining
) => {
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
      const waveTxn = await wavePortalContract.wave();
      handleSetTxn(waveTxn.hash);
      handleSetIsMining(true);

      // Wait for the transaction to get mined
      await waveTxn.wait();
      handleSetIsMining(false);

      // Read from contract again to update displayed waveCount
      const count = await wavePortalContract.getTotalWaves();
      handleSetWaveCount(count.toNumber());
    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log(error);
  }
};
