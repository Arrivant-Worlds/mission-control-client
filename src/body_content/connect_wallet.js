import React from "react";
import {
  WalletMultiButton,
  WalletDisconnectButton,
} from "@solana/wallet-adapter-react-ui";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useWallet } from "@solana/wallet-adapter-react";
import { useNavigate } from "react-router-dom";
import {
  create_user,
  get_user,
  get_quests,
  get_rewards,
  get_leaderboard,
} from "./../api_calls";
import { decodeUTF8 } from "tweetnacl-util";
import styles from "./connect_wallet_styles.js";
import  {createLedgerEmptyTX} from "../wallet/wallet.js"
export default function CONNECT_WALLET(props) {
  let navigate = useNavigate();
  const { wallet, signMessage, signTransaction ,publicKey, connected } = useWallet();

  const getData = async (wal, sig, pkey, signTx) => {
    if (props.wallet_data.signedMsg) {
      //use external function for signing?
      //check local storage/if wallet data exists
      //sign if it doesn't.
      //call the rest of the data if it does.
      return;
    } else {
      let now = Date.now();
      // // console.log(now, "time?");
      window.localStorage.setItem("signature_time", JSON.stringify(now));
      // // console.log(window.localStorage.getItem('signature_time'));
      let signedMsg = now.toString();
      const encodedMsg = decodeUTF8(signedMsg);
      let isLedger = window.localStorage.getItem("isLedger");
      let auto_approve = window.localStorage.getItem("auto_approve");

      let payload;
      if(isLedger) { 
        let ledgerTransaction = await createLedgerEmptyTX(pkey)
        let signedTX = (await signTx(ledgerTransaction)); 
        const dehydratedTx = signedTX.serialize({
          requireAllSignatures: false,
          verifySignatures: false
        })
        const serializedTX = dehydratedTx.toString('base64')

        payload = {
          auto_approve: auto_approve,
          signedMsg: signedMsg,
          transaction: serializedTX,
          isLedger: true,
          signature: JSON.stringify(Array.from(signedTX.signature)),
          pubkey: pkey.toString(),
        };
      }
      else {
        let signature = await sig(encodedMsg)
        payload = {
          auto_approve: auto_approve,
          signedMsg: signedMsg,
          isLedger: false,
          signature: JSON.stringify(Array.from(signature)),
          pubkey: pkey.toString(),
        };
      }


    
      //get user
      // const user_data = await get_user(payload);
      let user = get_user(payload);
      let leaderboard = get_leaderboard(payload);
      let quests = get_quests(payload);
      let rewards = get_rewards(payload);

      let userData = await user;
      let leaderboardData = await leaderboard;
      let questsData = await quests;
      let rewardsData = await rewards;
      props.change_user_data(userData);
      props.change_leaderboard_data(leaderboardData);
      props.change_quests_data(questsData);
      props.change_rewards_data(rewardsData);
      props.change_wallet_data(payload);
      //need some errorhandling here for if the user doesn't exist.

      // props.change_body_state("bounty_main");
      // console.log(user_data, "user_data");
      // unset loading when user_data comes back and is set to state.
    }
  };

  const handleDisconnect = () => {
    props.change_wallet_data({});
  };

  const handleDisconnectHover = () => {
    props.handleDisconnectHover();
  };

  const handleConnectHover = () => {
    props.handleConnectHover();
  };

  const handleNavigate = () => {
    navigate(`/bounty_main`);
  };

  return (
    <Box style={styles.button_container}>
      {!props.wallet_data.signedMsg ? (
        <WalletMultiButton
          onClick={() => getData(wallet, signMessage, publicKey, signTransaction)}
          onMouseEnter={() => handleConnectHover()}
        >
          CONNECT WALLET
        </WalletMultiButton>
      ) : (
        <Box style={styles.button_container}>
          <Box onMouseEnter={() => handleDisconnectHover()}>
            <WalletDisconnectButton
              onClick={() => handleDisconnect()}
              onMouseEnter={() => handleDisconnectHover()}
            />
          </Box>
          <Button
            variant="contained"
            style={styles.button}
            onClick={() => handleNavigate()}
          >
            DASHBOARD
          </Button>
        </Box>
      )}
    </Box>
  );
}
