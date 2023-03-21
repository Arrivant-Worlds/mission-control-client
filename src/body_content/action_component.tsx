import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Icon from "@mui/material/Icon";
import CONNECT_TWITTER from "./connect_twitter";
import { useAnalytics } from '../mixpanel';
import {
  submit_email,
  update_wallet,
} from "../api_calls";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { decodeUTF8 } from "tweetnacl-util";
import { useWallet } from "@solana/wallet-adapter-react";
import { AlertState, DialogData, MainProps, questResponseDTO, RewardsDialogData, RewardTypes } from "interfaces.js";
import { ConnectButton, useWalletKit } from "@mysten/wallet-kit";

export interface ActionComponentProps {
  setActionDone: (arg0: boolean) => void;
  handleClaimQuestReward: (reward_id: string, type_reward: RewardTypes) => void;
  actionDone: boolean;
  playRewardFanfare: () => void;
  handleTwitterButton: () => void;
  action_data: questResponseDTO['action'] | undefined
  user_data: MainProps['user_data']
  alert_state: AlertState
  dialog_data: DialogData | null
  handleNavigation: (path: string) => void;
  setAlertState: (alertState: AlertState) => void;
  handleDialogHover: () => void;
  getAuthHeaders: MainProps['getAuthHeaders']
}

export default function ACTION_COMPONENT(props: ActionComponentProps) {
  const SolanaWallet = useWallet()
  const SuiWallet = useWalletKit()
  const { track, setPropertyIfNotExists, increment, setProperty } = useAnalytics();
  const [claimed_state, change_claimed_state] = useState(false);
  const helper_style = {
    backgroundColor: "rgba(13, 13, 13, 0.9)",
    marginTop: "0px",
    marginRight: "0px",
    marginLeft: "0px",
    paddingTop: "3px",
    paddingLeft: "14px",
    paddingRight: "14px",
  };

  const [formValue, setFormValue] = useState("");
  const [nameFormValue, setNameFormValue] = useState("");
  const [formSubmission, setFormSubmission] = useState(false);
  const [errorState, setErrorState] = useState(false);
  const [helperText, setHelperText] = useState(" ");
  const [isWalletUpdateInProgress, setIsWalletUpdateInProgress] = useState<string | boolean>(false)
  const disabled_button = () => {
    if (!props.dialog_data) return true;
    if (props.dialog_data.recurrence === "permanent") {
      if (props.dialog_data.from === "mission" && props.actionDone) {
        return true;
      } else if (props.dialog_data.from === "mission") {
        return false;
      } else if (props.dialog_data.from === "log" && props.dialog_data.active_reward.length === 0) {
        return true;
      } else {
        return false;
      }
    }

    if (props.dialog_data.user_quest_status === "Locked") {
      return true;
    } else if (props.dialog_data.user_quest_status === "Complete" && props.dialog_data.active_reward.length === 0 || claimed_state) {
      return true;
    } else {
      return false;
    }
  };

  const handleLinkClick = (path: string | null) => {
    if (!path) return;
    props.setActionDone(true);
    window.open(path);
  };

  const handleRewardClaim = async () => {
    change_claimed_state(true);
    if (!props.dialog_data) return;
    props.playRewardFanfare();
    //@ts-ignore
    await props.handleClaimQuestReward(props.dialog_data.active_reward[0].id, props.dialog_data.type);
    try {
      track('Mission Claim', {
        event_category: 'Missions',
        event_label: props.dialog_data.title,
        xp: props.dialog_data.xp,
      })
      let now = new Date()
      setPropertyIfNotExists('First Mission Claim', `${now.getDay()}/${now.getMonth()}/${now.getFullYear()}`)
      setProperty('Last Mission Claim', `${now.getDay()}/${now.getMonth()}/${now.getFullYear()}`)
      setPropertyIfNotExists('Missions done', 0)
      //@ts-ignore
      increment('Missions done', 1);
    } catch (err) {
      console.log("MIXPANEL ERR", err)
    }
  };

  const handleInputChange = (e: any) => {
    const { value } = e.target;
    setFormValue(value);
  };

  const setWalletUpdating = async () => {
    console.log("is wallet connected?", SolanaWallet.connected)
    let signature: any
    let newWallet;
    if (SolanaWallet.connected && SolanaWallet.signMessage) {
      setIsWalletUpdateInProgress("Sign Message")
      const now = Date.now();
      const message = now.toString();
      const encodedMessage = decodeUTF8(message);
      signature = await SolanaWallet.signMessage(encodedMessage);
      newWallet = SolanaWallet.publicKey!.toBase58()
    } else if(SuiWallet.currentWallet?.connected){
      console.log("Im connected")
      newWallet = SuiWallet.accounts[0];
    } else {
      return;
    }
    console.log("got sig", signature)
    let authHeaders = await props.getAuthHeaders();
    if (!authHeaders) return;
    console.log("auth headers", authHeaders)
    try {
      await update_wallet(authHeaders, newWallet)
      setIsWalletUpdateInProgress("Success!")
      props.setAlertState({
        open: true,
        message: "Successfully updated wallet linked to this account",
        severity: "success",
      })
    } catch (err) {
      //@ts-ignore
      console.log("ERR IN UPDATE WALLET", err.response)
      //@ts-ignore
      if (err.response.status === 400) {
        setIsWalletUpdateInProgress("Error: Wallet already linked")
        props.setAlertState({
          open: true,
          message: "The wallet you provided is already linked to a different account",
          severity: "error",
        })
      } else {
        setIsWalletUpdateInProgress("There was an error")
        props.setAlertState({
          open: true,
          message: "Error occured",
          severity: "error",
        })
      }
  }
}


const handleNameInputChange = (e: any) => {
  const { value } = e.target;
  setNameFormValue(value);
};

const handleTwitterClick = () => {
  props.setActionDone(true);
  props.handleTwitterButton();
};

const handleReferralClick = () => {
  if (!props.action_data) return;
  props.setActionDone(true);
  navigator.clipboard.writeText(props.action_data.url);
  props.setAlertState({
    open: true,
    message:
      "Referral link copied!",
    severity: "success",
  });
};

const handleEmailSubmit = async (event: any) => {
  event.preventDefault();
  let emailForm = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (emailForm.test(formValue) && nameFormValue !== "") {
    setErrorState(false);
    setHelperText(" ");
    let header_verification = await props.getAuthHeaders();
    if (header_verification) {
      setFormSubmission(true);
      props.setActionDone(true);
      let email_submission = await submit_email(
        header_verification,
        formValue,
        nameFormValue
      );
    }
  } else {
    setErrorState(true);
    setHelperText("Incorrect email format");
  }
};
console.log("dialog data", props.dialog_data)
const type_render = () => {
  if (!props.dialog_data) return;
  if (props.dialog_data.recurrence === "permanent") {
    if (props.dialog_data.from === "log") {
      return (
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          sx={{ height: "100%", width: "100%", position: 'relative', zIndex: 1 }}
        >
          <Grid
            container
            direction="column"
            justifyContent="space-around"
            alignItems="flex-start"
            sx={{ height: "100%", width: "100%", padding: "10px" }}
          >
            <Typography sx={{ fontWeight: "700" }}>CONGRATULATIONS!</Typography>
            <Typography sx={{ fontSize: "18px", lineHeight: "25px", marginBottom: "15px" }}>
              Click the button below to claim
              your reward.
            </Typography>
            <Button
              variant="contained"
              disabled={disabled_button()}
              onClick={() => handleRewardClaim()}
              sx={{
                color: "black",
                fontSize: "14px",
                width: "100%",
                height: "55px",
                fontWeight: "700",
                backgroundColor: "#F6F6F6",
              }}
            >
              {props.dialog_data.user_quest_status === "Complete" && props.dialog_data.active_reward.length === 0 || claimed_state ? <Icon className={"fa-solid fa-check"}></Icon> : "CLAIM REWARD"}
            </Button>
          </Grid>
        </Grid>
      );
    } else {
      return (
        <Grid
          sx={{ height: "100%", width: "100%" }}
          container
          alignItems="center"
          justifyContent="center"
        >
          <Grid
            container
            direction="column"
            justifyContent="space-around"
            alignItems="flex-start"
            sx={{
              width: "90%",
              height: "100%",
            }}
          >
            <Typography sx={{ fontSize: "18px", lineHeight: "25px", fontWeight: "700", marginBottom: "15px", width: "100%", wordWrap: "break-word" }}>{props.action_data?.message}</Typography>
            <Button
              variant="contained"
              disabled={disabled_button()}
              onClick={props.dialog_data.type === "claim_caught_creature_reward" ? () => handleLinkClick(props.action_data?.url!) : () => handleReferralClick()}
              sx={{
                color: "black",
                fontSize: "14px",
                width: "100%",
                height: "55px",
                fontWeight: "700",
                padding: "0 20px",
                backgroundColor: "#F6F6F6",
              }}
            >
              {props.dialog_data.from === "mission" && props.actionDone ? <Icon className={"fa-solid fa-check"}></Icon> : props.action_data?.buttonText}
            </Button>
          </Grid>
        </Grid>
      );
    }
  }
  if (props.dialog_data.active_reward.length > 0) {
    return (
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        sx={{ height: "100%", width: "100%" }}
      >
        <Grid
          container
          direction="column"
          justifyContent="space-around"
          alignItems="flex-start"
          sx={{ height: "100%", width: "100%", padding: "10px" }}
        >
          <Typography sx={{ fontWeight: "700" }}>VERIFIED!</Typography>
          <Typography sx={{ fontSize: "18px", lineHeight: "25px", marginBottom: "15px" }}>
            Your submission has been verified! Click the button below to claim
            your reward.
          </Typography>
          <Button
            variant="contained"
            disabled={disabled_button()}
            onClick={() => handleRewardClaim()}
            sx={{
              color: "black",
              fontSize: "14px",
              width: "100%",
              height: "55px",
              fontWeight: "700",
              backgroundColor: "#F6F6F6",
            }}
          >
            {props.dialog_data.user_quest_status === "Complete" && props.dialog_data.active_reward.length === 0 || claimed_state ? <Icon className={"fa-solid fa-check"}></Icon> : "CLAIM REWARD"}
          </Button>
        </Grid>
      </Grid>
    );
  } else if (props.action_data?.type === "link") {
    console.log("sending to link", props.action_data?.url!)
    return (
      <Grid
        sx={{ height: "100%", width: "100%" }}
        container
        alignItems="center"
        justifyContent="center"
      >
        <Grid
          container
          direction="column"
          justifyContent="space-around"
          alignItems="flex-start"
          sx={{
            width: "90%",
            height: "100%",
          }}
        >
          <Typography sx={{ fontSize: "18px", lineHeight: "25px", fontWeight: "700", marginBottom: "15px" }}>{props.action_data.message}</Typography>
          <Button
            variant="contained"
            disabled={disabled_button()}
            onClick={() => handleLinkClick(props.action_data?.url!)}
            sx={{
              color: "black",
              fontSize: "14px",
              width: "100%",
              height: "55px",
              fontWeight: "700",
              padding: "0 20px",
              backgroundColor: "#F6F6F6",
            }}
          >
            {props.dialog_data.user_quest_status === "Complete" && props.dialog_data.active_reward.length === 0 ? <Icon className={"fa-solid fa-check"}></Icon> : props.action_data.buttonText}
          </Button>
        </Grid>
      </Grid>
    );
  } else if (props.action_data?.type === "form") {
    return (
      <Grid
        sx={{ height: "100%", width: "100%" }}
        container
        justifyContent="center"
        alignItems="center"
      >
        {formSubmission ? (
          <Typography sx={{ width: "90%", fontSize: "18px", lineHeight: "25px", fontWeight: "700", marginBottom: "15px" }}>Check your e-mail for verification!</Typography>
        ) : (
          <Typography sx={{ width: "90%", fontSize: "18px", lineHeight: "25px", fontWeight: "700", marginBottom: "15px" }}>
            {props.action_data?.message}
          </Typography>
        )}
        {formSubmission ? null : (
          <form
            onSubmit={handleEmailSubmit}
            style={{
              height: "90%",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <TextField
              variant="outlined"
              name="name"
              label="name"
              type="text"
              value={nameFormValue}
              onChange={handleNameInputChange}
              sx={{
                caretColor: "#F6F6F6",
                background: "rgba(106, 106, 106, 0.3)",
                width: "90%",
                marginBottom: "15px",
                input: {
                  color: "#F6F6F6",
                },
              }}
            />
            <TextField
              variant="outlined"
              name="email"
              label="email"
              type="text"
              error={errorState}
              helperText={helperText}
              FormHelperTextProps={{ style: helper_style }}
              value={formValue}
              onChange={handleInputChange}
              sx={{
                caretColor: "#F6F6F6",
                background: "rgba(106, 106, 106, 0.3)",
                width: "90%",
                input: {
                  color: "#F6F6F6",
                },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              disabled={disabled_button()}
              type="submit"
              sx={{
                color: "black",
                fontSize: "14px",
                width: "90%",
                height: "55px",
                fontWeight: "700",
                backgroundColor: "#F6F6F6",
              }}
            >
              {props.dialog_data.user_quest_status === "Complete" && props.dialog_data.active_reward.length === 0 ? <Icon className={"fa-solid fa-check"}></Icon> : props.action_data.buttonText}
            </Button>
          </form>
        )}
      </Grid>
    );
  } else if (props.action_data?.type === "updateWallet") {
    return (<Grid
      sx={{ height: "100%", width: "100%", position: "relative", zIndex: 1 }}
      container
      alignItems="center"
      justifyContent="center"
    >
      <Grid
        container
        direction="column"
        justifyContent="space-around"
        alignItems="flex-start"
        sx={{
          width: "90%",
          height: "100%",
        }}
      >
        <Typography sx={{ fontSize: "18px", lineHeight: "25px", fontWeight: "700", marginBottom: "15px" }}>{props.action_data.message}</Typography>
        {/* @ts-ignore */}
        <WalletMultiButton
          variant="contained"
          disabled={disabled_button()}
          onClick={() => setWalletUpdating()}
          sx={{
            color: "black",
            fontSize: "10px",
            width: "100%",
            height: "100%",
            fontWeight: "700",
            backgroundColor: "#F6F6F6",
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {isWalletUpdateInProgress ? (isWalletUpdateInProgress) : (props.action_data.buttonText)}
        </WalletMultiButton>
        <div onClick={()=>setWalletUpdating()}>
        <ConnectButton connectText={"Update wallet"}></ConnectButton>
        </div>
      </Grid>
    </Grid>
    )
  } else if (props.action_data?.type === "linkTwitter") {
    //twitter oauth component
    return (
      <Grid
        sx={{ height: "100%", width: "100%" }}
        container
        direction="column"
        justifyContent="space-around"
        alignItems="center"
      >
        <Grid
          container
          direction="column"
          justifyContent="space-around"
          alignItems="flex-start"
          sx={{
            width: "90%",
            height: "100%",
          }}
        >
          <Typography sx={{ fontSize: "18px", lineHeight: "25px", fontWeight: "700", marginBottom: "15px" }}>{props.action_data.message}</Typography>
          <CONNECT_TWITTER
            disabled={disabled_button()}
            variant="contained"
            style={{
              color: "black",
              fontSize: "14px",
              width: "100%",
              height: "55px",
              fontWeight: "700",
              backgroundColor: "#F6F6F6",
              padding: "0",
            }}
            handleButtonHover={() => props.handleDialogHover()}
            handleButtonClick={() => handleTwitterClick()}
            getAuthHeaders={props.getAuthHeaders}
            buttonText={props.action_data.buttonText}
            handleNavigation={props.handleNavigation}
            setAlertState={props.setAlertState}
          />
        </Grid>
      </Grid>
    );
  }

};

return <Box sx={{ height: "100%", padding: "15px 0px" }}>{type_render()}</Box>;
}
