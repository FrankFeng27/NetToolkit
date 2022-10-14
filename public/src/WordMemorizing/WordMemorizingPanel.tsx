import * as React from "react";
import styled from "styled-components";
import LoginPanel from "../Widgets/LoginPanel";

const NTKPanelContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;
const NTKVerboseContainer = styled.div`
  flex-grow: 10;
  display: flex;
  flex-direction: row;
  overflow: hidden;
`;

export interface NTKWordMemorizingPanelProps {
  isLoggedIn: boolean;
  onOpenSignInDlg: () => void;
  onOpenSignUpDlg: () => void;
}

export const NTKWordMemorizingPanel: React.FC<NTKWordMemorizingPanelProps> = (props: NTKWordMemorizingPanelProps) => {
  return (
    <NTKPanelContainer>
      {props.isLoggedIn ? (
        <NTKVerboseContainer style={{fontSize: 24}}>You've logged in.</NTKVerboseContainer>
      ) : (
        <LoginPanel onSignIn={props.onOpenSignInDlg} onSignUp={props.onOpenSignUpDlg} />
      )}
    </NTKPanelContainer>
  );
};

