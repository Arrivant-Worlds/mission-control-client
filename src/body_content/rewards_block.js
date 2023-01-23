import React, { useState, useEffect, memo } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Icon from "@mui/material/Icon";
import white_chest from "../images/chest.png";
import grey_chest from "../images/grey_chest.png";
import { claim_reward } from "./../api_calls";
import CircularProgress from "@mui/material/CircularProgress";
import styles from "./rewards_block_styles.js";

export const REWARDS_BLOCK = (props) => {

  const render_chest_image = (state, type) => {
    if (state === "claimable") {
      if(type === 'trait_pack'){
        return (
          <Box sx = {{display: "flex", marginRight: "10px"}}>
            <Typography sx = {{color: "white", fontSize: "0.75rem", padding: "5px", fontWeight: "bold", marginRight: "0.5rem", border: "solid", borderColor: "#BD825C", borderRadius: "0.5rem"}}>CLAIM</Typography> 
          </Box>
        );
      } else {
        return (
          <Box sx = {{display: "flex", marginRight: "10px"}}>
            <Typography sx = {{color: "white", fontSize: "0.75rem", padding: "5px", fontWeight: "bold", marginRight: "0.5rem", border: "solid", borderColor: "#e6b2b9", borderRadius: "0.5rem"}}>CLAIM</Typography> 
          </Box>
        );
      }

    } else if (state === "processing") {
      // console.log("processing")
      return (
        <Box sx={{display: "flex"}}>
          <CircularProgress size={20}/>
        </Box>
      )
    } else if (state === "locked") {
      return (
        <Box
          component="img"
          src={grey_chest}
          alt="chest symbol"
          style={styles.chest_symbol}
        />
      );
    } else {
      return (
        <Icon className={"fa-solid fa-check"}
        style={{
        color: "#888888",
        display: "flex",
        justifyContent: "center",
        fontSize: "20px",
      }}></Icon>
      )
    }
  };

  const handleOpenRewardDialog = async () => {
    props.set_rewards_dialog_data({
      xp: "something here",
      id: props.item_data.id,
      type: "journey",
      title: props.item_data.name,
      mint: props.item_data.mint,
      type_reward: props.item_data.rewards,
      description: props.item_data.description,
      status: props.item_data.claimed_status
    });
    props.handleRewardsOpen(true);
  };
  return (
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      style={
        props.item_data.rewards.type === "trait_pack" ? (
          props.item_data.claimed_status === "claimable" ? (
            styles.rewards_block_container_active_important
          ) : (
            styles.rewards_block_container_important
          ) 
          ) : (
          props.item_data.claimed_status === "locked" ? (
            styles.rewards_block_container
          ) : (
            styles.rewards_block_container_active
          )
          )
      }
      onClick={
       handleOpenRewardDialog
      }
    >
      <Grid
        container
        item
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ width: "100%" }}
      >
        <Grid
          container
          item
          direction="column"
          justifyContent="space-between"
          xs={1}
        >
          {
            props.item_data.name === "Claim Aurahma Whitelist Spot" ? (
              <div />
            ) : (
              <Typography
              style={
                props.item_data.rewards.type === "trait_pack" ? (
                  props.item_data.claimed_status === "claimable" ? (
                    styles.name_active_important
                  ) : (
                    styles.name_active_important
                  )
                ) : (
                  props.item_data.claimed_status === "locked" ? (
                    styles.name_inactive
                  ) : (
                    styles.name
                  )
                )
              }
            >
              LVL
            </Typography>
            )
          }
     
          <Typography
            style={
              props.item_data.rewards.type === "trait_pack" ? (
                props.item_data.claimed_status === "claimable" ? (
                  styles.name_active_important
                ) : (
                  styles.name_active_important
                )
              ) : (
                props.item_data.claimed_status === "locked" ? (
                  styles.name_inactive
                ) : (
                  styles.name
                )
              )
            }
          >
            {props.item_data.requiredLevel}
          </Typography>
        </Grid>
        <Grid
          container
          item
          xs={6}
          alignItems="flex-start"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: "2",
            WebkitBoxOrient: "vertical",
            textAlign: "left",
            height: "100%",
          }}
        >
          <Typography
            style={
              props.item_data.rewards.type === "trait_pack" ? (
                props.item_data.claimed_status === "claimable" ? (
                  styles.title_important
                ) : (
                  styles.title_important
                )
              ) : (
                props.item_data.claimed_status === "locked" ? (
                  styles.name_inactive
                ) : (
                  styles.title
                )
              )
            }
          >
            {props.item_data.name}
          </Typography>
        </Grid>
        <Grid container item xs={2}>
          {render_chest_image(props.item_data.claimed_status, props.item_data.rewards.type)}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default memo(REWARDS_BLOCK);
