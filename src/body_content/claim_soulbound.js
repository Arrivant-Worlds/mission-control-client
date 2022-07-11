import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import styles from "./mission_board_styles.js";
import { Transaction, Message } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { create_soulbound, confirm_soulbound } from "../api_calls/index.js";
import { RPC_CONNECTION_URL } from "../api_calls/constants.js";
import { Connection } from "@solana/web3.js";

export default function CLAIM_SOULBOUND(props) {
  const { signTransaction, sendTransaction } = useWallet();
  const connection = new Connection(RPC_CONNECTION_URL);

  //button implementation for later:
  // <CLAIM_SOULBOUND
  //           variant="contained"
  //           style={styles.button}
  //           wallet_data={props.wallet_data}
  //           handleButtonHover={() => handleOnHover()}
  //           handleButtonClick={() => handleClaimClick()}
  //         />

  const handleOnHover = () => {
    props.handleButtonHover();
  };

  const handleClick = async () => {
    props.handleButtonClick();

    let payload = {
      signedMsg: props.wallet_data.signedMsg,
      signature: props.wallet_data.signature,
      pubkey: props.wallet_data.pubkey,
    };
    console.log("payload", payload);
    // get trx from server
    let dehydratedTx = await create_soulbound(payload);
    let buffer = Buffer.from(dehydratedTx, "base64");
    const tx = Transaction.from(buffer);
    // user signs trx
    await signTransaction(tx);
    console.log("signed tx", tx);
    // broadcast trx to solana
    let sig = await sendTransaction(tx, connection);
    console.log("signature", sig);
    // send signature to server to verify completion
    let headers = {
      signedMsg: props.wallet_data.signedMsg,
      signature: props.wallet_data.signature,
      pubkey: props.wallet_data.pubkey,
      transaction: sig,
    };
    console.log("headers", headers);
    await confirm_soulbound(headers);
  };

  return (
    <Box>
      <Button
        variant={props.variant}
        style={props.style}
        onClick={() => handleClick()}
        onMouseEnter={() => handleOnHover()}
      >
        Claim
      </Button>
    </Box>
  );
}
