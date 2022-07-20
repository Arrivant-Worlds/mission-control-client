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
            In September, 2021, Our Team Received An SOS Message From The Deep Web — A World Hidden Within The Interstices Of Our Internet Networks Called To Us. Its Name Is Eleriah.
            </Typography>
            <Typography className="lore_text_2s" sx={styles.text}>
            We Are Now Crossing The Threshold.
            </Typography>
            <Typography className="lore_text_3s" sx={styles.text}>
            Someday Soon, You Will Form Your Tribe On One Of These Floating Lands; StarGardens. You Will Build Your City, Collect Powerful Creatures, And Explore The Unknown.
            </Typography>
            <Typography className="lore_text_4s" sx={styles.text}>
            To Prepare For This Grand Journey, You Must First Become An Elerian Citizen And Build Your CITIZEN I.D..
            </Typography>
            <Typography className="lore_text_5s" sx={styles.text}>
            Your CITIZEN I.D. Is Your Identity And Reputation In This New World. Other Citizens Will Know You By Your I.D. (And You Will Know Them By Theirs).
            </Typography>
            <Typography className="lore_text_6s" sx={styles.text}>
            Your I.D. Evolves Based On Your Actions, So Choose Them Wisely — For Only The Elerian Citizens With The Most Distinguished I.Ds Will Be Recruited To The Most Distinguished StarGardens. And Only The Most Accomplished StarGarden Owners Will Attract The Most Accomplished Elerian Citizens.
            </Typography>
            <Typography className="lore_text_7s" sx={styles.text}>
            Your Citizen I.D. Will Always Be At Your Side.
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
      {`BECOME A
        CITIZEN OF Eluüne`}
      </Typography>
    </Grid>
  );
}
