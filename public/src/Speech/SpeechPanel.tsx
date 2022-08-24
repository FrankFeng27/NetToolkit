import * as React from "react";
import styled from "styled-components";
import { CurrentSpeechLibrary, CurrentSpeechLibraryNodeId, SpeechLibraryItem, SpeechLibraryTreeNode } from "../dataprovider/data-types";
import LoginPanel from "../Widgets/LoginPanel";
import { NTKSpeechTextarea } from "./SpeechTextArea";
import { NTKSpeechToolbar, SpeechPlayState } from "./SpeechToolbar";
import { NTKSpeechSideNav } from "./SpeechSideNav";
import { AddSpeechLibraryDialog, IAddLibraryDialogData } from "./AddSpeechLibraryDialog";

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
  onTextChanged(text: string): void;
  isLoggedIn: boolean;
  onOpenSignInDlg: () => void;
  onOpenSignUpDlg: () => void;
  libraries?: SpeechLibraryItem[];
  currentLibrary?: CurrentSpeechLibrary;
  onLibrarySelect: (id: CurrentSpeechLibraryNodeId) => void;
  onAddLibrary: (name: string) => void;
  onRenameLibrary: (id: CurrentSpeechLibraryNodeId, newName: string) => void;
  onRemoveLibrary: (id: CurrentSpeechLibraryNodeId) => void;
}

const NTKSpeechPanel: React.FC<NTKSpeechPanelProps>  = (props: NTKSpeechPanelProps) => {
  const libText = props.currentLibrary ? props.currentLibrary.content : undefined;
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);

  function onOpenDialog() {
    setOpenDialog(true);
  }
  function onCloseDialog() {
    setOpenDialog(false);
  }
  function onAuditLibraryName(name: string) {
    return true;
  }
  function onAddLibrary(data: IAddLibraryDialogData) {
    props.onAddLibrary(data.name);
  }

  return (
    <NTKPanelContainer>
      {props.isLoggedIn ? (
        <NTKVerboseContainer>
        <NTKSpeechSideNav
          onOpenAddLibraryDialog={onOpenDialog} 
          libraries={props.libraries} 
          onLibrarySelect={props.onLibrarySelect} 
          currentLibrary={props.currentLibrary} 
          onRenameCurrentLibrary={props.onRenameLibrary}
          onRemoveCurrentLibrary={props.onRemoveLibrary}
        />
        <NTKSpeechWorkArea>
          <NTKSpeechToolbar text={libText}></NTKSpeechToolbar>
          <NTKSpeechTextarea onTextChanged={props.onTextChanged} text={libText}></NTKSpeechTextarea>
        </NTKSpeechWorkArea>
      </NTKVerboseContainer>
      ): <LoginPanel onSignIn={props.onOpenSignInDlg} onSignUp={props.onOpenSignUpDlg} />}
      <AddSpeechLibraryDialog 
       open={openDialog} 
       onCloseDialog={onCloseDialog} 
       onAuditLibraryName={onAuditLibraryName} 
       onAddLibrary={onAddLibrary}
      />
    </NTKPanelContainer>
  );
};

export default NTKSpeechPanel;
