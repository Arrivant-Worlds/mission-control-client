import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SimpleBar from "simplebar-react";
import styles from "./lore_page_styles.js";

export default function LORE_PAGE(props) {

  return (
    <Grid container direction="row" justifyContent="flex-end" sx={{width: "90%", marginTop: "50px"}}>
      <Grid sx={styles.text_container}>
        <SimpleBar style={styles.scroll_container}>
          <Grid sx={styles.inner_text_container} container direction="column" justifyContent="space-between">
            <Typography className="lore_text" sx={styles.text_first}>
            In September, 2021, our team received an SOS message from the deep web — a world hidden within the interstices of our internet networks called to us. Since then, we have worked to understand this mysterious new landscape. 
            </Typography>
            <Typography className="lore_text_2s" sx={styles.text}>
            We are now ready to cross the threshold.
            </Typography>
            <Typography className="lore_text_3s" sx={styles.text}>
            Someday soon, you will form your tribe on one of these StarGardens, where you will build your city, battle other tribes, collect powerful creatures, and explore the unknown.
            </Typography>
            <Typography className="lore_text_4s" sx={styles.text}>
            To prepare for this grand journey, you must first craft your Eluüne Visa.
            </Typography>
            <Typography className="lore_text_5s" sx={styles.text}>
            Your Visa is your identity in the Eluüne universe: your reputation, your calling, your persistent presence in this new world. Other travelers will know you by your Eluüne Visa (and you will know them by theirs).
            </Typography>
            <Typography className="lore_text_6s" sx={styles.text}>
            Your visa evolves based on your actions, so choose them wisely — for only the travelers with the most distinguished visas will be recruited to the most distinguished StarGardens. And only the most accomplished StarGarden owners will attract the most accomplished travelers.
            </Typography>
            <Typography className="lore_text_7s" sx={styles.text}>
            Whether you are completing missions, battling creatures, or riding the currents of the Unknown Sky-Sea of Legba, your Eluüne Visa will always be at your side. 
            </Typography>
            <Typography className="lore_text_8s" sx={styles.text}>
            Now and forever. 
            </Typography>
            <Typography className="lore_text_9s" sx={styles.text}>
            This is you.
            </Typography>
          </Grid>
        </SimpleBar>
      </Grid>
      <Typography sx={styles.welcome}>
      {`BECOME AN ELERIAN CITIZEN`}
      </Typography>
    </Grid>
  );
}
