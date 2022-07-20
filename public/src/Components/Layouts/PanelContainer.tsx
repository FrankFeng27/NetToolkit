
import * as React from "react";
import { styled } from "@material-ui/core/styles";
import { Box, BoxProps } from "@material-ui/core";
import { DRAWER_WIDTH } from "../../utils/constants";

interface StyledPanelProps extends BoxProps {
  open: boolean;
}

export const StyledPanel = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'open',
})<StyledPanelProps>(({ theme, open}) => ({
  height: "100%",
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${DRAWER_WIDTH}px)`,
    marginLeft: `${DRAWER_WIDTH}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.enteringScreen,
    })
  })
}));
