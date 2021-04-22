import { makeStyles } from "@material-ui/core/styles";
import { pink } from "@material-ui/core/colors";

export default makeStyles((theme) => ({
  logo:{
    maxWidth:"5rem",
    maxHeight:"2rem",
    width: "auto",
    height: "auto", margin:"0.5rem"
  },
  appBar: {
    background: "#616161 !important",
  },
  heading: {
    color: "black",
    textDecoration: "none"
  },
  link: {
    textDecoration: "none !important",
    color: "white !important",
  },
  image: {
    marginLeft: "15px",
  },
  profile: {
    display: "flex",
    justifyContent: "space-between",
  },
  pink: {
    color: theme.palette.getContrastText(pink[500]),
    backgroundColor: pink[500],
    margin: "0.5rem",
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
}));
