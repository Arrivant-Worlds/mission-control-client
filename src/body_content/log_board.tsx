import React, { useState, useEffect, memo } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SimpleBar from "simplebar-react";
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import styles from "./log_board_styles";
import MISSION_BLOCK from "./mission_block";
import plus from "../images/plus.png";
import minus from "../images/minus.png";
import { Button, CircularProgress } from "@mui/material";
import { AlertState, MainProps } from "interfaces";

interface LogBoardProps {
  user_data: MainProps['user_data']
  quests_data: MainProps['quests_data']
  handleClaimAllQuestRewards: () => void;
  handleDialogOpen: MainProps['handleDialogOpen']
  handleDialogClose: MainProps['handleDialogClose']
  handleDialogHover: () => void;
  dialog_data: MainProps['dialog_data']
  change_dialog_data: MainProps['change_dialog_data']
  setAlertState: (data: AlertState) => void;
  playQuestType: () => void;
}

export const LOG_BOARD = (props: LogBoardProps) => {
  const [expanded_tab, change_expanded_tab] = useState(true);
  const [isClaimAllClicked, setIsClaimAllClicked] = useState(false);
  const handleClick = (tab: any) => {
    props.playQuestType();
    change_expanded_tab(tab);
  };
  const display_data = [...(props.quests_data!)].sort((a,b) => {
    if (a.active_reward.length === 0) {
      return 1;
    }

    if (b.active_reward.length === 0) {
      return -1;
    }

    if (a.active_reward === b.active_reward) {
      return 0;
    }
    return a.active_reward < b.active_reward ? -1 : 1;
  })

  const anyActiveRewards = display_data.some((item) => item.user_quest_status !== "Locked" && item.active_reward.length > 0);
  return (
    <Box style={styles.log_board_container}>
      <Grid container item direction="column" justifyContent="space-between"
      style={styles.log_grid_container} sx={{marginBottom: "0px !important"}} alignItems="center">
        <Grid container item direction="row" justifyContent="space-between"
        onClick={() => handleClick(!expanded_tab)} alignItems="center">
          <Grid item container direction="column" xs={11} sx = {{padding: "3px"}}>
            <Typography style={styles.log_title}
              >
              COMPLETED MISSION LOG
            </Typography>
          </Grid>
          <Box component="img" src={expanded_tab ? minus : plus}
          style={expanded_tab ? styles.minus : styles.plus}/>
        </Grid>
        <Button
            variant="outlined"
            style = {{ 
              display: anyActiveRewards ? "block" : "none",
              //@ts-ignore
              disabled: isClaimAllClicked,
              width: "40%",
              fontWeight: "500",
              height: "30%",
              margin: "auto",
            }}
            onClick = {() => {
              setIsClaimAllClicked(true)
              props.handleClaimAllQuestRewards()
            }}
        > {isClaimAllClicked ?     <CircularProgress size = {20}/>
        : "Claim ALL"}  </Button>
        <Box style={expanded_tab ? styles.hr : styles.hidden}/>
        <SimpleBar style={ expanded_tab ? { height: '534px', width: "100%" } : styles.hidden}>
          {/* @ts-ignore */}
          <Box style={expanded_tab ? styles.content_container : styles.hidden}
          >
            {
              display_data.map((item, i) => {
                if (item.active_reward.length > 0 || item.user_quest_status === "Complete" || item.recurrence === "permanent" && item.active_reward.length > 0) {
                  if (item.user_quest_status === "Locked" && item.recurrence === "prime") {
                    return (
                      <Tooltip
                        key={i}
                        title="Please complete all the Syncs before attempting this mission"
                      >
                        <Box>
                          {props.user_data && (
                            <MISSION_BLOCK
                            item_data={item} key={i}
                            handleDialogOpen={props.handleDialogOpen}
                            dialog_data={props.dialog_data}
                            change_dialog_data={props.change_dialog_data}
                            handleDialogHover={props.handleDialogHover}
                            user_data={props.user_data}
                            setAlertState={props.setAlertState}
                            from="log"
                            />
                          )}
                         
                        </Box>
                      </Tooltip>
                    )
                  } else {
                    return (
                      <Box>
                      {props.user_data && (
                      <MISSION_BLOCK
                        item_data={item} key={i}
                        handleDialogOpen={props.handleDialogOpen}
                        dialog_data={props.dialog_data}
                        change_dialog_data={props.change_dialog_data}
                        handleDialogHover={props.handleDialogHover}
                        user_data={props.user_data}
                        setAlertState={props.setAlertState}
                        from="log"
                      />
                      )}
                      </Box>
                      
                    )
                  }
                } else {
                  return null;
                }
              })
            }
          </Box>
        </SimpleBar>
      </Grid>
    </Box>
  );
}

export default memo(LOG_BOARD);
