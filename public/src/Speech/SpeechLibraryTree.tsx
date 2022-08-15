import * as React from "react";
import styled from "styled-components";
import { TreeView, TreeItem, treeItemClasses } from "@mui/lab";
import { styled as muiStyled } from "@mui/material";
import { ChevronRight, ExpandMore } from "@mui/icons-material";
import { CurrentSpeechLibrary, CurrentSpeechLibraryNodeId, SpeechLibraryItem, SpeechLibraryTreeNode } from "../dataprovider/data-types";
import { areCurrentLibraryNodeIdsEqual, buildTreeItemId, buildTreeItemIdByNodeId, createLibraryTree, getLibraryNodeIdFromCurrentLibrary, getLibraryNodeIdFromTreeNode, getLibraryNodeIdFromTreeNodeId } from "./SpeechUtils";
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
  curLibraryNodeId?: CurrentSpeechLibraryNodeId;
  onNodeRename: (nodeId: CurrentSpeechLibraryNodeId, newName: string) => void;
  onNodeRemove: (nodeId: CurrentSpeechLibraryNodeId) => void;
}

export const SpeechLibraryTree: React.FC<SpeechLibraryTreeProps> = (props: SpeechLibraryTreeProps) => {
  function onNodeSelect(_event: React.SyntheticEvent, nodeIds: string) {
    if (props.curLibraryNodeId) {
      // check if we need to switch current node
      const speechId = getLibraryNodeIdFromTreeNodeId(nodeIds);
      if (areCurrentLibraryNodeIdsEqual(speechId, props.curLibraryNodeId)) {}
    }
    props.onNodeSelect(nodeIds);
  }
  function onLabelTextChanged(nodeId: CurrentSpeechLibraryNodeId, v: string) {

  }
  const createLibraryWidget = (node: SpeechLibraryTreeNode, curNodeId: CurrentSpeechLibraryNodeId) => {
    const id = getLibraryNodeIdFromTreeNode(node);
    const children = ((node.children && node.children.length > 0) ? node.children.map(n => createLibraryWidget(n, curNodeId)) : undefined);
    return  (<SpeechLibraryTreeItem onLabelTextChanged={onLabelTextChanged} curNodeId={curNodeId} nodeId={id} label={node.displayName}>
      {children}
    </SpeechLibraryTreeItem>)
  };
  const createLibraryWidgets = (libs?: SpeechLibraryItem[]) => {
    const tree = createLibraryTree(libs);
    const selected = props.curLibraryNodeId ? buildTreeItemIdByNodeId(props.curLibraryNodeId) : undefined;
    const curNodeId = (props.curLibraryNodeId);
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

  return (createLibraryWidgets(props.libraries));
};
