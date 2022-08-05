import * as React from "react";
import MuiAppBar from "@mui/material/AppBar";
import {
  AppBarProps as MuiAppBarProps,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { styled } from "@mui/material/styles";

import { DataAccessor, ErrorStatus } from "../dataprovider/dataprovider";
import { DRAWER_WIDTH } from "../utils/constants";
import { LogInTypeEnum } from "../dataprovider/data-types";
/// import LoginDialog, { IFormInput } from "./LoginDialog";
/// import CurrentContext from "../CurrentContext";
import{ ISigInUpData } from "../LoginDialog/LoginDialog";
import NTKLoginDialogWrapper from "../LoginDialog/LoginDialogContainer";

const RootContainer = styled('div')`
  flex-grow: 1;
`;

interface AppBarProps extends MuiAppBarProps {
  open: boolean;
}

const StyledAppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${DRAWER_WIDTH}px)`,
    marginLeft: `${DRAWER_WIDTH}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const StyledMenuButton = styled(IconButton)(({ theme }) => ({
  marginRight: theme.spacing(3)
}));

const StyledTitleTypo = styled(Typography)`
  flex-grow: 1
`;

const StyledIconButton = styled(IconButton)`
  font-size: 1.2rem
`;

export interface HeaderbarProps {
  title: string;
  openDrawer: boolean;
  onOpenDrawer: () => void;
  isLoggedIn: boolean;
  onOpenSignInDlg: () => void;
  onOpenSignUpDlg: () => void;
  setIsLoggedIn: (v: boolean) => void;
}

const UtilitiesHeaderbar: React.FC<HeaderbarProps> = (props: HeaderbarProps) => {
  const [anchorElement, setAnchorElement] = React.useState<Element | null>(
    null
  );
    
  function handleSignOut() {
    handleMenuClose();
    DataAccessor.signOut().then((res) => {
      DataAccessor.isLoggedIn().then((isLoggedIn) => {
        props.setIsLoggedIn(isLoggedIn !== undefined ? isLoggedIn : false);
      });
    });
  }

  function handleMenuClose() {
    setAnchorElement(null);
  }
  function handleMenuPopup(event: React.MouseEvent<HTMLElement>) {
    setAnchorElement(event.currentTarget);
  }
  function isMenuPopup() {
    return Boolean(anchorElement !== null);
  }
  function handleSignIn() {
    handleMenuClose();
    props.onOpenSignInDlg();
  }
  function handleSignUp() {
    handleMenuClose();
    props.onOpenSignUpDlg();
  }
  function handleDrawerOpen() {
    props.onOpenDrawer();
  }

  return (
    <StyledAppBar position="static" open={props.openDrawer}>
      <Toolbar>
        <StyledMenuButton 
        edge="start" 
        color="inherit"
        aria-label="open drawer"
        onClick={handleDrawerOpen}
        >
          <MenuIcon />
        </StyledMenuButton>
        <StyledTitleTypo align="center" variant="h3">
          {props.title}
        </StyledTitleTypo>
        <StyledIconButton color="inherit" onClick={handleMenuPopup}>
          Log In
        </StyledIconButton>
        {props.isLoggedIn ? (
          <Menu
            id="menu-appbar"
            anchorEl={anchorElement}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center"
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right"
            }}
            open={isMenuPopup()}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>My account</MenuItem>
            <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
          </Menu>
        ) : (
          <Menu
            id="menu-appbar"
            anchorEl={anchorElement}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            keepMounted
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            open={isMenuPopup()}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleSignIn}>Sign In</MenuItem>
            <MenuItem onClick={handleSignUp}>Sign Up</MenuItem>
          </Menu>
        )}
        <NTKLoginDialogWrapper setIsLoggedIn={props.setIsLoggedIn} />
      </Toolbar>
    </StyledAppBar>
  );
};

export default UtilitiesHeaderbar;

