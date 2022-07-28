import * as React from "react";
import { CurrentSpeechLibraryNodeId } from "../dataprovider/data-types";

interface SpeechLibraryTreeItemProps {
  label: string;
  nodeId: CurrentSpeechLibraryNodeId;
  curNodeId: CurrentSpeechLibraryNodeId;
  onLableTextChanged: (nodeId: CurrentSpeechLibraryNodeId, value: string) => void;
}
export const SpeechLibraryTreeItem: React.FC<SpeechLibraryTreeItemProps> = (props: SpeechLibraryTreeItemProps) => {
  return (<div/>);
};