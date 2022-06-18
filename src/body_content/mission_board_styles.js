const styles = {
  mission_board_container: {
    width: "100%",
  },
  mission_grid_container: {
    padding: "15px",
    background: "linear-gradient(180deg, rgba(0, 0, 0, 0.42) 25.01%, rgba(15, 15, 15, 0.3) 120.09%)",
    border: "1px solid #6A6A6A",
    boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.35)",
    backdropFilter: "blur(40px)",
    borderRadius: "5px",
    marginBottom: "5px",
  },
  content_container: {
    height: "395px",
    // overflowY: "scroll",
  },
  mission_title: {
    fontSize: "20px",
    fontWeight: "700",
  },
  mission_title_not_active: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#888888",
  },
  plus: {
    width: "10px",
    cursor: "pointer",
  },
  minus: {
    width: "10px",
  },
  hr: {
    marginTop: "7px",
    width: "100%",
    height: "1px",
    backgroundColor: "#888888",
  },
  hidden: {
    display: "none",
  },
};

export default styles;
