import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SimpleBar from "simplebar-react";
import 'animate.css';
import styles from "./lore_page_styles.js";

export default function LORE_PAGE(props) {

  const scrollbar_options = {
    scrollbar: "lore_scrollbar",
    track: "lore_track"
  }

  return (
    <Grid container direction="row" justifyContent="flex-end" sx={{width: "90%", marginTop: "50px"}}>
      <Grid sx={styles.text_container}>
        <SimpleBar style={styles.scroll_container}>
          <Grid sx={styles.inner_text_container} container direction="column" justifyContent="space-between">
            <Typography className="lore_text" sx={styles.text_first}>
            In September, 2021, our team received an SOS message from the deep web—a world hidden within the interstices of our internet networks. Since then, we have worked tirelessly to interpret and understand this mysterious new landscape.
            </Typography>
            <Typography className="lore_text_2s" sx={styles.text}>
            At last, we are ready to cross the threshold and chart our own course across the StarGardens.
            </Typography>
            <Typography className="lore_text_3s" sx={styles.text}>
            And you are invited to join us.
            </Typography>
            <Typography className="lore_text_4s" sx={styles.text}>
            This is your Eluüne Visa. It doubles as your passport and itinerary as you explore the other side, stake your claim in the great unknown, and uncover unimaginable opportunities over our digital horizon.
            </Typography>
            <Typography className="lore_text_5s" sx={styles.text}>
            Your Eluüne Visa is your identity in our universe: your reputation, your calling, your immutable presence in our world. Other travelers will know you by your Eluüne Visa (and you will know them by theirs) as you work together to generate prosperity and wonder across twenty unique techno-fantasy domains.
            </Typography>
          </Grid>
        </SimpleBar>
      </Grid>
      <Typography sx={styles.welcome}>
      {`WelCome
        to YOUR
        ElUüNE VISA`}
      </Typography>
    </Grid>
  );
}
