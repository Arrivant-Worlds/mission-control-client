import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import SimpleBar from "simplebar-react";
import styles from "./lore_page_styles";

export default function LORE_PAGE() {

  return (
    <Grid container direction="row" justifyContent="flex-end" sx={{width: "90%", marginTop: "50px", position: "relative"}}>
      <Grid sx={styles.text_container}>
        {/* @ts-ignore */}
        <SimpleBar style={styles.scroll_container}>
          <Grid sx={styles.inner_text_container} container direction="column" justifyContent="space-between">
            <Typography className="lore_text" sx={styles.text_first}>
            In September 2021, Our Team Received An SOS Message... A World Hidden Within The Interstices Of Our Internet Networks Called To Us... Its Name Is Eleriah.
            </Typography>
            <Typography className="lore_text_2s" sx={styles.text}>
            We Are Now Crossing The Threshold. Soon, You Will Form Your Tribe On One Of Eleriah's Floating Lands: StarGardens. Together, You Will Build Your City, Collect Powerful Creatures, And Explore The Unknown.
            </Typography>
            <Typography className="lore_text_3s" sx={styles.text}>
            To Prepare For This Grand Journey, You Must First Become A Citizen of Eluüne And Create Your ELUÜNE I.D.
            </Typography>
            <Typography className="lore_text_4s" sx={styles.text}>
            Your ELUÜNE I.D. Is Your Identity And Reputation In This New World. Other Citizens Will Know You By Your I.D. (And You Will Know Them By Theirs). Your I.D. Evolves Based On Your Actions, So Choose Them Wisely — For Only The Citizens of Eluüne With The Most Distinguished I.D.'s Will Be Recruited To The Most Distinguished StarGardens. And Only The Most Accomplished StarGarden Owners Will Attract The Most Accomplished Citizens of Eluüne.
            </Typography>
            <Typography className="lore_text_5s" sx={styles.text}>
            Your Eluüne I.D. Will Always Be At Your Side. Now And Forever. This Is You.
            </Typography>
            <Typography className="lore_text_6s" sx={styles.text}>
            And Only Together Do We Transcend.
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
