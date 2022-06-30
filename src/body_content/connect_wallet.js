import React from 'react';
import { WalletMultiButton, WalletDisconnectButton } from "@solana/wallet-adapter-react-ui";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useWallet } from "@solana/wallet-adapter-react";
import { useNavigate } from "react-router-dom";
import {create_user, get_user, get_quests, get_rewards, get_leaderboard} from "./../api_calls";
import { decodeUTF8 } from "tweetnacl-util";
import styles from './connect_wallet_styles.js';

export default function CONNECT_WALLET(props) {
  let navigate = useNavigate();
  const { wallet, signMessage, publicKey, connected } = useWallet();

  const getData = async (wal, sig, pkey) => {

    if (props.wallet_data.signedMsg) {
      //use external function for signing?
        //check local storage/if wallet data exists
          //sign if it doesn't.
        //call the rest of the data if it does.
      return;
    } else {
      let now = Date.now();
      // // console.log(now, "time?");
      window.localStorage.setItem('signature_time', JSON.stringify(now));
      // // console.log(window.localStorage.getItem('signature_time'));
      let signedMsg = now.toString();
      const encodedMsg = decodeUTF8(signedMsg);
      const signature = await sig(encodedMsg);

      const payload = {
        signedMsg: signedMsg,
        signature: JSON.stringify(Array.from(signature)),
        pubkey: pkey.toString(),
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
  }

  const handleNavigate = () => {
    navigate(`/bounty_main`);
  }

  return (
    <Box style={styles.button_container}>
      {!props.wallet_data.signedMsg ?
        <WalletMultiButton onClick={() => getData(wallet, signMessage, publicKey)}>
        CONNECT WALLET
        </WalletMultiButton>
        :
        <Box style={styles.button_container}>
          <WalletDisconnectButton onClick={() => handleDisconnect()}/>
          <Button variant="contained" style={styles.button} onClick={() => handleNavigate()}>DASHBOARD</Button>
        </Box>
      }
    </Box>
  );
}
