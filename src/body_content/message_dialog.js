import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Icon from "@mui/material/Icon";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

export default function MESSAGE_DIALOG(props) {

  return (
    <Dialog
      open={props.message_dialog.open}
      onClose={props.handleMessageClose}
      BackdropProps={{
        style: {
          background: "rgba(26, 32, 38, 0.8)",
          opacity: "0.8",
        },
      }}
      PaperProps={{
        style: {
          background: "radial-gradient(143.78% 66.7% at 46.76% 50%, rgba(44, 89, 96, 0.94) 0%, #000000 100%)",
          border: "1px solid #B5CCD5",
          boxShadow: "3px 4px 47px rgba(181, 204, 213, 0.8)",
          borderRadius: "5px",
          minHeight: "100px",
          width: 'auto',
          height: "auto",
        },
      }}
    >
      <DialogContent sx={{height: "150px"}}>
        <IconButton
          aria-label="close"
          onClick={() => props.handleMessageClose()}
          sx={{
            position: "absolute",
            right: 0,
            top: 0,
            color: "#6A6A6A",
          }}
        >
          <CloseIcon />
        </IconButton>
        <Box sx={{height: "100%", display: "flex", alignItems: "center", justifyContent: "center"}}>
          <Typography style = {{whiteSpace: "nowrap"}}>
          {props.message_dialog.text}
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
