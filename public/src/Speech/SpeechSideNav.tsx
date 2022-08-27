import * as React from "react";
import styled from "styled-components";
import { Button } from "@mui/material";
import { CurrentSpeechLibrary, CurrentSpeechLibraryNodeId, SpeechLibraryItem } from "../dataprovider/data-types";
import { SpeechLibraryTree } from "./SpeechLibraryTree";
import { getLibraryNodeIdFromTreeNodeId } from "./SpeechUtils";

const SideNavbarContainer = styled.div`
  width: 150px;
  min-width: 120px;
  flex-grow: 0;
  display:flex;
  flex-direction: column;
  padding: 20px 10px;
`;
const SideNavItem = styled.div`
  font-size: 12px;
  font-family: Arial;
  display: flex;
  flex-direction: row;
  margin: 5px;
  align-items: center;
`;

export interface NTKSpeechSideNavProps {
  libraries?: SpeechLibraryItem[];
  currentLibrary?: CurrentSpeechLibrary;
  onLibrarySelect: (id: CurrentSpeechLibraryNodeId) => void;
  onOpenAddLibraryDialog: () => void;
  onRenameCurrentLibrary: (nodeId: CurrentSpeechLibraryNodeId, name: string) => void;
  onRemoveCurrentLibrary: (nodeId: CurrentSpeechLibraryNodeId) => void;
}

export const NTKSpeechSideNav: React.FC<NTKSpeechSideNavProps> = (props: NTKSpeechSideNavProps) => {
  function onLibraryNodeSelect(nodeId: string) {
    const id = getLibraryNodeIdFromTreeNodeId(nodeId);
    props.onLibrarySelect(id);
  }
  function onNodeRename(id: CurrentSpeechLibraryNodeId, newName: string) {
    props.onRenameCurrentLibrary(id, newName);
  }
  function onNodeRemove(id: CurrentSpeechLibraryNodeId) {
    props.onRemoveCurrentLibrary(id);
  }

  const curNodeId: CurrentSpeechLibraryNodeId | undefined = props.currentLibrary ? 
  (props.currentLibrary.id !== undefined ? {libraryId: props.currentLibrary.id.toString(), name: props.currentLibrary.name} : {name: props.currentLibrary.name}) :
  undefined;
  return (
    <SideNavbarContainer>
      <SideNavItem>
        <Button variant="text" 
          sx={{
            fontSize: 12, 
            padding: "0 2px",
            ":hover": {backgroundColor: "primary.light", color: "primary.contrastText"},
            borderRadius: 0
          }} 
          onClick={props.onOpenAddLibraryDialog}>Add Library ...</Button>
      </SideNavItem>
      <SideNavItem>
        <SpeechLibraryTree 
        libraries={props.libraries}
        curLibraryNodeId={curNodeId}
        onNodeSelect={onLibraryNodeSelect} 
        onNodeRename={onNodeRename}
        onNodeRemove={onNodeRemove}
        />
      </SideNavItem>
    </SideNavbarContainer>
  );
};
