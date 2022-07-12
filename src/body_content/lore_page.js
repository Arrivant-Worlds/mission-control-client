import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SimpleBar from "simplebar-react";
import styles from "./lore_page_styles.js";

export default function LORE_PAGE(props) {

  return (
    <Grid container direction="row" justifyContent="flex-end">
      <Grid sx={styles.text_container}>
        <SimpleBar style={styles.inner_text_container}>
          <Typography sx={styles.text}>
            In September, 2021, our team received an SOS message from the deep web—a world hidden within the interstices of our internet networks. Since then, we have worked tirelessly to interpret and understand this mysterious new landscape.
          </Typography>
          <Typography sx={styles.text}>
            At last, we are ready to cross the threshold and chart our own course across the StarGardens.
          </Typography>
          <Typography sx={styles.text}>
            And you are invited to join us.
          </Typography>
          <Typography sx={styles.text}>
            This is your Eluüne Visa. It doubles as your passport and itinerary as you explore the other side, stake your claim in the great unknown, and uncover unimaginable opportunities over our digital horizon.
          </Typography>
          <Typography sx={styles.text}>
            Your Eluüne Visa is your identity in our universe: your reputation, your calling, your immutable presence in our world. Other travelers will know you by your Eluüne Visa (and you will know them by theirs) as you work together to generate prosperity and wonder across twenty unique techno-fantasy domains.
          </Typography>
        </SimpleBar>
      </Grid>
    </Grid>
  );
}
