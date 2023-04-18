const styles = {
  active_mission_block_container: {
    marginTop: "10px",
    padding: "5px 15px",
    border: "0.9px solid #888888",
    borderRadius: "5px",
    cursor: "pointer",
    width: "95%",
    "&:hover": { border: "0.9px solid #F9F9F9 !important"},
  },
  inactive_mission_block_container: {
    marginTop: "10px",
    padding: "5px 15px",
    border: "0.9px solid #888888",
    borderRadius: "5px",
    width: "95%",
  },
  claim_mission_block_container: {
    marginTop: "10px",
    padding: "5px 15px",
    border: "0.9px solid #e6b2b9",
    borderRadius: "5px",
    width: "95%",
  },
  complete_mission_block_container: {
    marginTop: "10px",
    padding: "5px 15px",
    border: "0.9px solid #888888",
    borderRadius: "5px",
    width: "95%",
  },
  active_title: {
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
    fontSize: "14px",
    fontWeight: "700",
    maxWidth: "100%",
    textTransform: "uppercase",
  },
  inactive_title: {
    textOverflow: "ellipsis",
    color: "#888888",
    overflow: "hidden",
    whiteSpace: "nowrap",
    fontSize: "14px",
    fontWeight: "700",
    maxWidth: "100%",
    textTransform: "uppercase",
  },
  complete_title: {
    textOverflow: "ellipsis",
    color: "#888888",
    overflow: "hidden",
    whiteSpace: "nowrap",
    fontSize: "14px",
    fontWeight: "700",
    maxWidth: "100%",
    textTransform: "uppercase",
  },
  claim_title: {
    textOverflow: "ellipsis",
    color: "#F6F6F6",
    overflow: "hidden",
    whiteSpace: "nowrap",
    fontSize: "14px",
    fontWeight: "700",
    maxWidth: "100%",
    textTransform: "uppercase",
  },
  active_description: {
    textAlign: "left",
    fontSize: "14px",
    fontWeight: "700",
    textTransform: "uppercase",
    color: "#888888",
  },
  inactive_description: {
    textAlign: "left",
    fontSize: "14px",
    fontWeight: "700",
    textTransform: "uppercase",
    color: "#888888",
  },
  complete_description: {
    textAlign: "left",
    fontSize: "14px",
    fontWeight: "700",
    textTransform: "uppercase",
    color: "#888888",
  },
  claim_description: {
    textAlign: "left",
    fontSize: "14px",
    fontWeight: "700",
    textTransform: "uppercase",
    color: "#888888",
  },
  active_xp: {
    marginLeft: "10px",
    fontSize: "14px",
    fontWeight: "700",
    textTransform: "uppercase",
    color: "#e6b2b9",
  },
  inactive_xp: {
    marginLeft: "10px",
    fontSize: "14px",
    fontWeight: "700",
    textTransform: "uppercase",
    color: "#888888",
  },
  complete_xp: {
    marginLeft: "10px",
    fontSize: "14px",
    fontWeight: "700",
    textTransform: "uppercase",
    color: "#888888",
  },
  claim_xp: {
    marginLeft: "10px",
    fontSize: "14px",
    fontWeight: "700",
    textTransform: "uppercase",
    color: "#e6b2b9",
  },
  active_icon: {
    color: "#FFFFFF",
    display: "flex",
    justifyContent: "center",
    fontSize: "20px",
  },
  inactive_icon: {
    color: "#888888",
    display: "flex",
    justifyContent: "center",
    fontSize: "20px",
  },
  complete_icon: {
    color: "#888888",
    display: "flex",
    justifyContent: "center",
    fontSize: "20px",
  },
  claim_icon: {
    color: "#F6F6F6",
    display: "flex",
    justifyContent: "center",
    fontSize: "20px",
  },
};

export default styles;