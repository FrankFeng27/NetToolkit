
import * as React from "react";
import { styled } from "@material-ui/core/styles";

import MemoCategoryPane from "./MemoCategoryPane";
import LoginPanel from "./LoginPanel";

const StyledMemoPanel = styled('div')`
  display: flex;
  flex-direction: column;
`;

const StyledMemoCategoryPaneContainer = styled('div')`
  flex-grow: 0;
`;

export interface MemoPanelProps {
  isLoggedIn: boolean;
  onOpenSignInDlg: () => void;
  onOpenSignUpDlg: () => void;
  placeholder: boolean;
  placeholderDispatch: () => void;
}

const MemoPanel: React.FC<MemoPanelProps> = (props: MemoPanelProps) => {
  function onSignInClicked() {
    props.onOpenSignInDlg();
  }
  function onSignUpClicked() {
    props.onOpenSignUpDlg();
  }
  return props.isLoggedIn ? (
    <StyledMemoPanel>
      <StyledMemoCategoryPaneContainer>
        <MemoCategoryPane />
      </StyledMemoCategoryPaneContainer>
    </StyledMemoPanel>
  ) : (<LoginPanel onSignIn={onSignInClicked} onSignUp={onSignUpClicked} />);
};

export default MemoPanel;
