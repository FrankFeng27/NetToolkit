import * as React from "react";
import styled from "styled-components";
import { CurrentSpeechLibrary, CurrentSpeechLibraryNodeId, SpeechLibraryItem, SpeechLibraryTreeNode } from "../dataprovider/data-types";
import { SpeechLibraryTree } from "./SpeechLibraryTree";
import { getLibraryNodeIdFromTreeNodeId } from "./SpeechUtils";

const SideNavbarContainer = styled.div`
  width: 120px;
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
}

export const NTKSpeechSideNav: React.FC<NTKSpeechSideNavProps> = (props: NTKSpeechSideNavProps) => {
  function onLibraryNodeSelect(nodeId: string) {
    const id = getLibraryNodeIdFromTreeNodeId(nodeId);
    props.onLibrarySelect(id);
  }
  function onNodeRename(id: CurrentSpeechLibraryNodeId) {}
  function onNodeRemove(id: CurrentSpeechLibraryNodeId) {}
  const curNodeId: CurrentSpeechLibraryNodeId | undefined = props.currentLibrary ? 
  (props.currentLibrary.libraryId ? {libraryId: props.currentLibrary.libraryId} : {name: props.currentLibrary.name}) :
  undefined;
  return (
    <SideNavbarContainer>
      <SideNavItem>Add Library ...</SideNavItem>
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
