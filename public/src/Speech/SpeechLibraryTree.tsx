import * as React from "react";
import styled from "styled-components";
import { TreeView, TreeItem, treeItemClasses } from "@mui/lab";
import { styled as muiStyled } from "@mui/material";
import { ChevronRight, ExpandMore } from "@mui/icons-material";
import { CurrentSpeechLibrary, CurrentSpeechLibraryNodeId, SpeechLibraryItem, SpeechLibraryTreeNode } from "../dataprovider/data-types";
import { buildTreeItemId, createLibraryTree, getLibraryNodeIdFromCurrentLibrary, getLibraryNodeIdFromTreeNode, getLibraryNodeIdFromTreeNodeId } from "./SpeechUtils";
import { SpeechLibraryTreeItem } from "./SpeechLibraryTreeItem";

const LibraryTreeContainer = styled.div`
  flex-grow: 10;
  display: flex;
  flex-direction: column;
`;
const LibrariesLabel = styled.div`
  flex-grow: 0;
`;

export interface SpeechLibraryTreeProps {
  onNodeSelect: (nodeIds: string) => void;
  libraries?: SpeechLibraryItem[];
  curLibraryNode?: CurrentSpeechLibrary;
  onNodeRename: (nodeId: CurrentSpeechLibraryNodeId, newName: string) => void;
  onNodeRemove: (nodeId: CurrentSpeechLibraryNodeId) => void;
}

export const SpeechLibraryTree: React.FC<SpeechLibraryTreeProps> = (props: SpeechLibraryTreeProps) => {
  function onNodeSelect(_event: React.SyntheticEvent, nodeIds: string) {
    if (props.curLibraryNode) {
      // check if we need to switch current node
      const speechId = getLibraryNodeIdFromTreeNodeId(nodeIds);
      if (props.curLibraryNode.libraryId && props.curLibraryNode.libraryId === speechId.libraryId) {}
    }
    props.onNodeSelect(nodeIds);
  }
  function onLabelTextChanged(nodeId: CurrentSpeechLibraryNodeId, v: string) {

  }
  const createLibraryWidget = (node: SpeechLibraryTreeNode, curNodeId: CurrentSpeechLibraryNodeId) => {
    const id = getLibraryNodeIdFromTreeNode(node);
    return (<SpeechLibraryTreeItem onLabelTextChanged={onLabelTextChanged} curNodeId={curNodeId} nodeId={id} label={node.displayName}>
      {(node.children && node.children.length > 0) ? node.children.map(n => createLibraryWidget(n, curNodeId)) : null}
    </SpeechLibraryTreeItem>)
  };
  const createLibraryWidgets = (libs?: SpeechLibraryItem[], curLibraryNode?: CurrentSpeechLibrary) => {
    const tree = createLibraryTree(libs);
    const selected = curLibraryNode ? buildTreeItemId(curLibraryNode) : undefined;
    const curNodeId = getLibraryNodeIdFromCurrentLibrary(props.curLibraryNode);
    return (<LibraryTreeContainer>
      <LibrariesLabel>Libraries</LibrariesLabel>
      <TreeView
      aria-label="rich object"
      defaultCollapseIcon={<ExpandMore />}
      defaultExpandIcon={<ChevronRight />}
      selected={selected}
      onNodeSelect={onNodeSelect}
      sx={{ fontSize: 'inherit', minHeight: 110, flexGrow: 1, maxWidth: 400, overflowY: 'auto', overflowX: 'clip' }}
      >
        {(tree && tree.length > 0) ? tree.map(n => (createLibraryWidget(n, curNodeId))) : null}
      </TreeView>
    </LibraryTreeContainer>)
  };

  return (
    <TreeView></TreeView>
  )
};
