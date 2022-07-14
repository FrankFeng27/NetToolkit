import * as React from "react";
import styled from "styled-components";
import { SpeechLibraryItem } from "../dataprovider/data-types";
import LoginPanel from "../Components/Widgets/LoginPanel";
import { SpeechTextarea } from "../Components/Widgets/SpeechTextArea";
import { SpeechToolbar } from "../Components/Widgets/SpeechToolbar";
import { SpeechSideNav } from "../Components/Widgets/SpeechSideNav";

const PanelContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const VerboseContainer = styled.div`
  flex-grow: 10;
  display: flex;
  flex-direction: row;
`;
const SpeechWorkArea = styled.div`
  flex-grow: 10;
  display: flex;
  flex-direction: column;
  padding: 20px 10px 40px 10px;
`;

interface SpeechPanelProps {
  text?: string;
  onTextChanged(text: string): void;
  isLoggedIn: boolean;
  onOpenSignInDlg: () => void;
  onOpenSignUpDlg: () => void;
  libraries?: SpeechLibraryItem[];
}

const SpeechPanel: React.FC<SpeechPanelProps>  = (props: SpeechPanelProps) => {
  return (
    <PanelContainer>
      {props.isLoggedIn ? (
        <VerboseContainer>
        <SpeechSideNav libraries={props.libraries} />
        <SpeechWorkArea>
          <SpeechToolbar></SpeechToolbar>
          <SpeechTextarea {...props}></SpeechTextarea>
        </SpeechWorkArea>
      </VerboseContainer>
      ): <LoginPanel onSignIn={props.onOpenSignInDlg} onSignUp={props.onOpenSignUpDlg} />}
    </PanelContainer>
  );
};
