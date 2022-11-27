import { useEffect, useState } from 'react';
import {
  findMetaMaskAccount,
  getAllWaves,
  listenForEvents,
} from 'helpers/main';

export const useApp = () => {
  const [currentAccount, setCurrentAccount] = useState('');
  const [waveCount, setWaveCount] = useState(null);
  const [allWaves, setAllWaves] = useState(null);
  const [txn, setTxn] = useState('');
  const [isMining, setIsMining] = useState(false);
  const [message, setMessage] = useState('');
  const [popupMessage, setPopupMessage] = useState(null);
  const [hasMetamask, setHasMetamask] = useState(false);

  const handleSetCurrentAccount = (account) => {
    setCurrentAccount(account);
  };

  const handleSetTxn = (txn) => {
    setTxn(txn);
  };

  const handleSetHasMetamask = (hasMetamask) => {
    setHasMetamask(hasMetamask);
  };

  const handleSetWaveCount = (waveCount) => {
    if (waveCount >= allWaves.length) setWaveCount(waveCount);
  };

  const handleSetIsMining = (isMining) => {
    setIsMining(isMining);
  };

  const handleSetAllWaves = (allWaves) => {
    setAllWaves(allWaves);
  };

  const handleSetMessage = (message) => {
    setMessage(message);
  };

  const addNewWaveToAllWaves = (wave) => {
    setAllWaves((prevState) => [wave, ...prevState]);
  };

  const dispatchPopupMessage = (popupMessage) => {
    setPopupMessage(popupMessage);
  };

  const resetMessage = () => {
    setMessage('');
  };

  useEffect(() => {
    (async () => {
      await findMetaMaskAccount(handleSetHasMetamask, handleSetCurrentAccount);
    })();
    getAllWaves(handleSetAllWaves);

    const { wavePortalContract, onNewWave } =
      listenForEvents(addNewWaveToAllWaves);

    return () => {
      if (wavePortalContract) {
        wavePortalContract.off('NewWave', onNewWave);
      }
    };
  }, []);

  useEffect(() => {
    if (allWaves) setWaveCount(allWaves.length);
  }, [allWaves]);

  useEffect(() => {
    if (popupMessage) {
      // Reset popup message after 7s from dispatch so it can appear again
      setTimeout(() => setPopupMessage(null), 7000);
    }
  }, [popupMessage]);

  return {
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
  };
};
