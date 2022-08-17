import * as React from "react";
import styled from "styled-components";
import { CurrentSpeechLibrary, CurrentSpeechLibraryNodeId, SpeechLibraryItem, SpeechLibraryTreeNode } from "../dataprovider/data-types";
import LoginPanel from "../Widgets/LoginPanel";
import { NTKSpeechTextarea } from "./SpeechTextArea";
import { NTKSpeechToolbar, SpeechPlayState } from "./SpeechToolbar";
import { NTKSpeechSideNav } from "./SpeechSideNav";

const NTKPanelContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const NTKVerboseContainer = styled.div`
  flex-grow: 10;
  display: flex;
  flex-direction: row;
`;
const NTKSpeechWorkArea = styled.div`
  flex-grow: 10;
  display: flex;
  flex-direction: column;
  padding: 20px 10px 40px 10px;
`;

export interface NTKSpeechPanelProps {
  text?: string;
  onTextChanged(text: string): void;
  isLoggedIn: boolean;
  onOpenSignInDlg: () => void;
  onOpenSignUpDlg: () => void;
  libraries?: SpeechLibraryItem[];
  currentLibrary?: CurrentSpeechLibrary;
  onLibrarySelect: (id: CurrentSpeechLibraryNodeId) => void;
}

const NTKSpeechPanel: React.FC<NTKSpeechPanelProps>  = (props: NTKSpeechPanelProps) => {
  const [playState, setPlayState] = React.useState<SpeechPlayState>(SpeechPlayState.kUnknown);
  function onPlay() {
    const synth = window.speechSynthesis;
    if (props.text) {
      const utter = new SpeechSynthesisUtterance(props.text);
      synth.speak(utter);
      
    }
  }
  const libText = props.currentLibrary ? props.currentLibrary.content : undefined;
  return (
    <NTKPanelContainer>
      {props.isLoggedIn ? (
        <NTKVerboseContainer>
        <NTKSpeechSideNav libraries={props.libraries} onLibrarySelect={props.onLibrarySelect} currentLibrary={props.currentLibrary} />
        <NTKSpeechWorkArea>
          <NTKSpeechToolbar playState={playState}></NTKSpeechToolbar>
          <NTKSpeechTextarea onTextChanged={props.onTextChanged} text={libText}></NTKSpeechTextarea>
        </NTKSpeechWorkArea>
      </NTKVerboseContainer>
      ): <LoginPanel onSignIn={props.onOpenSignInDlg} onSignUp={props.onOpenSignUpDlg} />}
    </NTKPanelContainer>
  );
};

export default NTKSpeechPanel;
