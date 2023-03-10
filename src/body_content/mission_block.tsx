import React, { useState, useEffect, memo } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Icon from "@mui/material/Icon";
import Badge from '@mui/material/Badge';
import styles from "./mission_block_styles";
import { useAnalytics } from "../mixpanel";
import { AlertState, MainProps, questResponseDTO, userResponseDTO } from "interfaces";

interface MissionBlockProps  {
  playQuestType?: () => void;
  handleDialogHover: () => void;
  item_data: questResponseDTO;
  from: "log" | "mission";
  handleDialogOpen: () => void
  dialog_data: questResponseDTO;
  change_dialog_data: (data: questResponseDTO) => void;
  user_data: userResponseDTO
  setAlertState: (data: AlertState) => void;
}

export function MISSION_BLOCK(props: MissionBlockProps) {
  const { track } = useAnalytics()
  const handleOnClick = () => {
    const merged_dialog_data = {...props.item_data, from: props.from};
    props.change_dialog_data(merged_dialog_data);
    props.handleDialogOpen();
    if (props.user_data.daily_claim_remaining === 0 && props.item_data.active_reward.length > 0) {
      // props.setAlertState({
      //   open: true,
      //   message: "Daily claim limit reached! Come back tomorrow!",
      //   severity: "error",
      // });
    }
    try{
      track('View Mission',{
        event_category: 'Missions',
        event_label: `${props.item_data.title}`,
        current_user_level: `${props.user_data.xp}`
      })
    } catch(err){
      console.log("mixpanel ERR", err)
    }

  };

  const handleOnHover = () => {
    props.handleDialogHover();
  };

  const renderIcon = () => {
    if (props.item_data.user_quest_status === "Complete" || props.item_data.active_reward.length > 0) {
      return(
        <Icon className={"fa-solid fa-check"} style={render_style("icon")}></Icon>
      );
    } else if (props.item_data.platform === "Discord") {
      return (
        <Icon className={"fa-brands fa-discord"} style={render_style("icon")}></Icon>
      );
    } else if (props.item_data.platform === "twitter") {
      return (
        <Icon className={"fa-brands fa-twitter"} style={render_style("icon")}></Icon>
      );
    } else if (props.item_data.platform === "Email") {
      return (
        <Icon className={"fa-solid fa-envelope"} style={render_style("icon")}></Icon>
      );
    } else {
      return null;
    }
  };

  const render_style = (section: any) => {
    if (props.item_data.recurrence === "permanent") {
      if (props.from === "mission") {
        let style_name = `active_${section}`;
        //@ts-ignore
        return styles[style_name];
      } else if (props.from === "log" && props.item_data.active_reward.length > 0) {
        let style_name = `claim_${section}`;
        //@ts-ignore
        return styles[style_name];
      } else if (props.from === "log" && props.item_data.active_reward.length === 0) {
        let style_name = `complete_${section}`;
        //@ts-ignore
        return styles[style_name];
      }
    } else if (props.item_data.user_quest_status === "Available") {
      let style_name = `active_${section}`;
        //@ts-ignore
      return styles[style_name];
    } else if (props.item_data.user_quest_status === "Locked") {
      let style_name = `inactive_${section}`;
        //@ts-ignore
      return styles[style_name];
    } else if (props.item_data.active_reward.length > 0) {
      let style_name = `claim_${section}`;
        //@ts-ignore
      return styles[style_name];
    } else if (props.item_data.user_quest_status === "Complete" && props.item_data.active_reward.length === 0) {
      let style_name = `complete_${section}`;
        //@ts-ignore
      return styles[style_name];
    }
  }

  const render_tooltip_claim = () => {
    if (props.from === "log" && props.item_data.active_reward.length > 0) {
      if (props.item_data.recurrence === "permanent" && props.item_data.type !== "claim_caught_creature_reward" || props.item_data.recurrence === "daily") {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  return (
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        sx={render_style("mission_block_container")}
        onClick={() => handleOnClick()}
        onMouseEnter={() => handleOnHover()}
      >
        <Grid container item direction="column" xs={11}>
          <Grid
            container
            item
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
          >
            <Grid container item direction="row" justifyContent="flex-start" xs={8}>
              <Typography style={render_style("title")}>{props.item_data.title}</Typography>
            </Grid>
            <Grid container item justifyContent="center" alignItems="center" xs>
              <Typography
              style={render_style("xp")}
              >{`+${props.item_data.xp} XP`}</Typography>
            </Grid>
          </Grid>
          <Typography style={render_style("description")}
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: "2",
              WebkitBoxOrient: "vertical",
            }}
          >
            {props.item_data.description}
          </Typography>
        </Grid>
        <Grid container item xs={1} justifyContent="center" alignItems="center">
          <Badge
          badgeContent={props.from === "log" && props.item_data.active_reward.length > 0 ? props.item_data.active_reward.length : 0} color="primary"
            sx={{
              "& .MuiBadge-badge": {
                backgroundColor: "#f6f6f6f6 !important"
              }
            }}>
            {renderIcon()}
          </Badge>
        </Grid>
      </Grid>
  );
}

export default memo(MISSION_BLOCK);

