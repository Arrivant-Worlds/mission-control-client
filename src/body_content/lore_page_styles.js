const styles = {
  text_container: {
    width: "584px",
    height: "606px",

    background: "linear-gradient(180deg, rgba(0, 0, 0, 0.644) 25.01%, rgba(15, 15, 15, 0.46) 120.09%)",
    border: "1px solid #6A6A6A",
    boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.35)",
    backdropFilter: "blur(10px)",
    /* Note: backdrop-filter has minimal browser support */
    borderRadius: "5px",
    position: "relative",
  },
  scroll_container: {
    height: "500px",
    width: "80%",
    position: "relative",
    top: "50px",
    right: "-60px",
  },
  inner_text_container: {
    width: "85%",
  },
  text_first: {
    textAlign: "left",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: "17px",
    lineHeight: "24px",
    letterSpacing: "0.1em",
    textTransform: "capitalize",
    color: "#FFFFFF",
    opacity: "0",
  },
  text: {
    textAlign: "left",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: "17px",
    lineHeight: "24px",
    letterSpacing: "0.1em",
    textTransform: "capitalize",
    color: "#FFFFFF",
    marginTop: "30px",
    opacity: "0",
  },
  welcome: {
    textAlign: "left",
    fontWeight: "700",
    fontSize: "36px",
    lineHeight: "40px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#F6F6F6",
    position: "absolute",
    left: "180px",
    top: "160px",
    whiteSpace: "pre-line",
  }
}

export default styles;
