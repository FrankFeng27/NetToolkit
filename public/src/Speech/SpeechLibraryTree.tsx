import * as React from "react";
import styled from "styled-components";
import { TreeView, TreeItem, treeItemClasses } from "@material-ui/lab";
import { styled as muiStyled } from "@material-ui/core/styles";
import { CurrentSpeechLibrary, CurrentSpeechLibraryNodeId, SpeechLibraryItem } from "../dataprovider/data-types";
import { createLibraryTree } from "./SpeechUtils";

const StyledTreeItemRoot = muiStyled(TreeItem)( ({theme}) => ({
  [`.${treeItemClasses.content}`]: {
    fontSize: 12,
  }
}) );


export interface SpeechLibraryTreeProps {
  onNodeSelect: (nodeIds: string) => void;
  libraries?: SpeechLibraryItem[];
  curLibraryNode?: CurrentSpeechLibrary;
  onNodeRename: (nodeId: CurrentSpeechLibraryNodeId, newName: string) => void;
  onNodeRemove: (nodeId: CurrentSpeechLibraryNodeId) => void;
}

export const SpeechLibraryTree: React.FC<SpeechLibraryTreeProps> = (props: SpeechLibraryTreeProps) => {
  const tree = createLibraryTree(props.libraries);
  
  return (
    <TreeView></TreeView>
  )
};
