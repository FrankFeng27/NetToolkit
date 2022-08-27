import * as React from "react";
import styled from "styled-components";
import { styled as muiStyled } from "@mui/material";
import { TreeItem, treeItemClasses, TreeItemProps } from "@mui/lab";
import { CurrentSpeechLibraryNodeId } from "../dataprovider/data-types";
import { TreeItemContentComponent } from "./TreeItemContentComponent";
import { buildTreeItemIdByNodeId } from "./SpeechUtils";

const StyledTreeItemRoot = muiStyled(TreeItem)(( {theme} ) => ({
  [`.${treeItemClasses.content} .${treeItemClasses.label}`]: {
    fontSize: 12,
  },
  [`& .${treeItemClasses.label}`]: {
    fontSize: 12,
  }
}));

export interface SpeechLibraryTreeItemProps {
  label: string;
  nodeId: CurrentSpeechLibraryNodeId;
  curNodeId: CurrentSpeechLibraryNodeId;
  onLabelTextChanged: (nodeId: CurrentSpeechLibraryNodeId, value: string) => void;
  /**
   * The content of the component.
   */
  children?: React.ReactNode;
}

export const SpeechLibraryTreeItem: React.FC<SpeechLibraryTreeItemProps> = (
  props: SpeechLibraryTreeItemProps
) => {
  function onLabelChanged(value: string) {
    props.onLabelTextChanged(props.nodeId, value);
  }

  const id = buildTreeItemIdByNodeId(props.nodeId);
  const currentId = props.curNodeId ? buildTreeItemIdByNodeId(props.curNodeId) : "";
  const labelText = props.label;
  const name = props.nodeId.name;
  return (
    <StyledTreeItemRoot
    key={id}
    nodeId={id}
    ContentComponent={TreeItemContentComponent}
    ContentProps={{labelText, id, name, currentId, onLabelChanged} as any}
    children={props.children}
    />
  );
}

