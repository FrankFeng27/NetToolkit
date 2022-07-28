import { CurrentSpeechLibraryNodeId } from "../dataprovider/data-types";

interface SpeechLibraryTreeItemProps {
    label: string;
    nodeId: CurrentSpeechLibraryNodeId;
    curNodeId: CurrentSpeechLibraryNodeId;
    onLableTextChanged: (nodeId: CurrentSpeechLibraryNodeId, value: string) => void;
  }
  const SpeechLibraryTreeItem: React.FC<SpeechLibraryTreeItemProps> = (props: SpeechLibraryTreeItemProps) => {
    
  };