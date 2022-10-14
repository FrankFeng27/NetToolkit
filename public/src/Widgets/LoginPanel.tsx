
import * as React from "react";
import { styled } from "@mui/material/styles";

const StyledA = styled('a')`
  cursor: pointer;
  color: blue;
`;

const StyledMemoPanel = styled('div')`
  display: flex;
  flex-direction: column;
`;

const StyledMemoCategoryPaneContainer = styled('div')`
  flex-grow: 0;
`;


interface LoginPanelProps {
  onSignIn: () => void;
  onSignUp: () => void;
}

const LoginPanel: React.FC<LoginPanelProps> = (props: LoginPanelProps) => {
  return (<div>Please <StyledA onClick={props.onSignIn}>sign in</StyledA> or <StyledA onClick={props.onSignUp}>sign up</StyledA> </div>);
};

export default LoginPanel;
