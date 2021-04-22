import React, { useState, useEffect, useContext } from "react";
import {
  AppBar,
  Typography,
  Toolbar,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Badge,
  Tooltip,
} from "@material-ui/core";
import MoreIcon from "@material-ui/icons/MoreVert";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import decode from "jwt-decode";
import * as actionType from "../../constants/actionTypes";
import useStyles from "./styles";
import { ShepherdTour, ShepherdTourContext } from "react-shepherd";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import HelpIcon from "@material-ui/icons/Help";
import getSteps from "./getSteps";

const tourOptions = {
  defaultStepOptions: {
    cancelIcon: {
      enabled: true,
    },
  },
  useModalOverlay: true,
};

const Navbar = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
  const dispatch = useDispatch();
  const location = useLocation();
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const classes = useStyles();
  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };
  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  function TourButton() {
    const tour = useContext(ShepherdTourContext);
    return !isMobileMenuOpen ? (
      <Tooltip title="View page tour." aria-label="add">
        <IconButton color="inherit">
          <Badge color="secondary">
            <HelpIcon
              onClick={() => {
                handleMobileMenuClose();
                tour.start();
              }}
            />
          </Badge>
        </IconButton>
      </Tooltip>
    ) : (
      <MenuItem
        onClick={() => {
          handleMobileMenuClose();
          tour.start();
        }}
      >
        View Page Tour
      </MenuItem>
    );
  }
  const logout = () => {
    dispatch({ type: actionType.LOGOUT });
    setUser(null);
    window.location = "/";
  };
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={"menu-mobile"}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {user?.result ? (
        <div>
          <MenuItem>
            <Avatar
              className={classes.pink}
              alt={user?.result.name}
              src={user?.result.imageUrl}
            >
              {user?.result.name.charAt(0)}
            </Avatar>
            <Typography variant="h6">{user?.result.name}</Typography>
          </MenuItem>
          <ShepherdTour steps={getSteps()} tourOptions={tourOptions}>
            <TourButton />
          </ShepherdTour>
          <MenuItem onClick={logout}>Logout</MenuItem>
        </div>
      ) : (
        <MenuItem>
          <Link to="/auth" style={{ color: "black" }}>
            Sign In / Register
          </Link>
        </MenuItem>
      )}
    </Menu>
  );

  useEffect(() => {
    const token = user?.token;

    if (token) {
      const decodedToken = decode(token);

      if (decodedToken.exp * 1000 < new Date().getTime()) logout();
    }

    setUser(JSON.parse(localStorage.getItem("profile")));
  }, [location]);

  return (
    <div
      className={classes.grow}
      style={{ position: "static", marginBottom: "6rem" }}
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Typography className={classes.heading} variant="h5" align="center">
            <Link to="/" className={classes.link}>
              ShardShare
            </Link>
          </Typography>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            {user?.result ? (
              <div className={classes.profile}>
                <MenuItem>
                  <Avatar
                    className={classes.pink}
                    alt={user?.result.name}
                    src={user?.result.imageUrl}
                  >
                    {user?.result.name.charAt(0)}
                  </Avatar>
                  <Typography variant="h6">{user?.result.name}</Typography>
                </MenuItem>
                <ShepherdTour steps={getSteps()} tourOptions={tourOptions}>
                  <TourButton />
                </ShepherdTour>
                <Tooltip title="Logout" aria-label="add">
                  <IconButton color="inherit">
                    <Badge color="secondary">
                      <ExitToAppIcon onClick={logout} />
                    </Badge>
                  </IconButton>
                </Tooltip>
              </div>
            ) : (
              <Link to="/auth" className={classes.link}>
                <MenuItem>Sign In / Register</MenuItem>
              </Link>
            )}
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={"menu-mobile"}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
    </div>
  );
};

export default Navbar;
