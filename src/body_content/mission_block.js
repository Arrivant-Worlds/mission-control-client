import React, { useState, useEffect, memo } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Icon from "@mui/material/Icon";
import Badge from '@mui/material/Badge';
import styles from "./mission_block_styles.js";
import { useAnalytics } from "../mixpanel.js";

export function MISSION_BLOCK(props) {
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

  const render_style = (section) => {
    if (props.item_data.recurrence === "permanent") {
      if (props.from === "mission") {
        let style_name = `active_${section}`;
        return styles[style_name];
      } else if (props.from === "log" && props.item_data.active_reward.length > 0) {
        let style_name = `claim_${section}`;
        return styles[style_name];
      } else if (props.from === "log" && props.item_data.active_reward.length === 0) {
        let style_name = `complete_${section}`;
        return styles[style_name];
      }
    } else if (props.item_data.user_quest_status === "Available") {
      let style_name = `active_${section}`;
      return styles[style_name];
    } else if (props.item_data.user_quest_status === "Locked") {
      let style_name = `inactive_${section}`;
      return styles[style_name];
    } else if (props.item_data.active_reward.length > 0) {
      let style_name = `claim_${section}`;
      return styles[style_name];
    } else if (props.item_data.user_quest_status === "Complete" && props.item_data.active_reward.length === 0) {
      let style_name = `complete_${section}`;
      return styles[style_name];
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
              <Typography style={render_style("title")}>{props.item_data.title}</Typography>
              <Typography
                style={render_style("xp")}
              >{`+${props.item_data.xp} XP`}</Typography>
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
            <Badge className="permanent_mission_badge"
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
