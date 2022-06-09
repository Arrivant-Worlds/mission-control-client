import React, { useState, useEffect } from 'react';
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import styles from './connect_wallet_styles.js';

export default function CONNECT_WALLET(props) {
  const { wallet, signMessage, publicKey } = useWallet();
  console.log(wallet, "wallet");
  console.log(signMessage, "sign_message");
  console.log(publicKey, "public key");
  return (
    <WalletMultiButton>
      CONNECT WALLET
    </WalletMultiButton>
  );
}
