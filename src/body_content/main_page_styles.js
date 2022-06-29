const styles = {
  container: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  grid_container: {
    marginTop: "-75px",
    height: "90%",
  },
  text: {
    textTransform: "uppercase",
    margin: "0 auto",
    fontSize: "18px",
    width: "60%",
  },
  button_container: {
    display: "grid",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    gridColumn: "1",
    gridRow: "1",
    color: "#111111",
    fontSize: "16px",
    fontWeight: "700",
    width: "198px",
    height: "56px",
    backgroundColor: "#F6F6F6",
  },
  ripple_diamond: {
    margin: "0 auto",
    gridColumn: "1",
    gridRow: "1",
  }
};

export default styles;
