const styles = {
  tab_label_container: {
    width: "80%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    // '@media screen and (maxWidth: 2000px)': {
    //   // fontSize: "26px",
    //   width: "80%",
    // },
  },
  tab_label: {
    textAlign: "left",
    alignItems: "baseline",
    minWidth: "0px",
    position: "relative",
  },
  center_panel_container: {
    width: "270px",
    height: "397px",
    background: "linear-gradient(180deg, rgba(0, 0, 0, 0.539) 25.01%, rgba(15, 15, 15, 0.285) 120.09%)",
    /* box (blurred) */
    border: "0.916143px solid #6A6A6A",
    backdropFilter: "blur(36.6457px)",
    /* Note: backdrop-filter has minimal browser support */
    borderRadius: "4.58071px 61.3816px 4.58071px 4.58071px",
    marginBottom: "23px",
    marginLeft: "2px",
    display: "flex",
    justiftContent: "center",
    alignItems: "center",
  },
  tab_label_grid: {
    position: "relative",
    width: "70%",
  },
  tab_label_grid_2: {
    position: "relative",
  },
  tab_container: {
    // borderBottom: "2px solid #888888",
  },
  bottom_border: {
    position: "absolute",
    height: "2px",
    bottom: "0",
    width: "100%",
    backgroundColor: "#888888",
  },
  tab_content_container: {
    width: "100%",
    height: "600px",
    // '@media screen and (maxWidth: 1200px)': {
    //   // fontSize: "26px",
    //   height: "600px",
    // },
  }
};

export default styles;
