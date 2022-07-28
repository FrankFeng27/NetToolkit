import * as React from "react";
import { useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { setSpeechText } from "../actions";
import { RootState } from "../dataprovider/data-types";
import NTKSpeechPanel, { NTKSpeechPanelProps } from "./SpeechPanel";
import { addLibraryAsCurrent, getLibraries, getLibraryForCurLibraryNode, setCurrentLibraryNode, SpeechState, updateCurrentLibrary } from "./SpeechSlice";
import { getCurrentLibraryNodeByLibraryNodeId, getLibraryNodeIdFromTreeNodeId } from "./SpeechUtils";

interface OwnProps {
  isLoggedIn: boolean;
  onOpenSignInDlg: () => void;
  onOpenSignUpDlg: () => void;
}

interface DispatchProps {
  onTextChanged: (text: string) => void;
}

const mapStateToProps = (state: RootState): SpeechState => {

  return {...state.speeches};
};
const mapDispatchToProps = dispatch => ({
  onTextChanged: text => dispatch(setSpeechText(text)),
});

// test
const libs = [{
  id: 1,
  name: "/test/2022-6-27/memo",
  content: "balahbalah",
  userName: "fengsh",
  configuration: "{\"speed\": 1}"
}, {
  id: 2,
  name: "/test/2022-6-28/thoughts",
  content: "balahbalah",
  userName: "fengsh",
  configuration: "{\"speed\": 1}"
}, {
  id: 3,
  name: "/test/2022-7-7/news",
  content: "balahbalah",
  userName: "fengsh",
  configuration: "{\"speed\": 1}"
}];

const NTKSpeechPanelWrapper: React.FC<NTKSpeechPanelProps> = (props: NTKSpeechPanelProps) => {
  const dispatch = useDispatch();
  const libraries = useSelector((state: RootState) => {
    return state.speeches?.libraries ?? [];
  });
  const curNode = useSelector((state:RootState) => (state.speeches.currentLibraryNode));
  const isLoggedIn = props.isLoggedIn;
  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    dispatch(getLibraries());
  }, [isLoggedIn]);

  function onTextChange(text: string) {
    if (!curNode) {
      dispatch(addLibraryAsCurrent({name: "", content: text, configuration: "{}"}));
    } else {
      dispatch(updateCurrentLibrary({id: parseInt(curNode.libraryId), content: text,
        name: curNode.name, configuration: curNode.configuration}));
    }
  }
  function onNodeSelect(nodeIds: string) {
    if (nodeIds.length === 0) {
      setCurrentLibraryNode(undefined);
    }
    const nodeId = nodeIds;
    const libraryId = getLibraryNodeIdFromTreeNodeId(nodeId);
    dispatch(setCurrentLibraryNode(getCurrentLibraryNodeByLibraryNodeId(libraryId, libs)));
    if (libraryId.libraryId) {
      dispatch(getLibraryForCurLibraryNode(libraryId.libraryId));
    }
  }

  const libs = [...libraries];
  return (
    <NTKSpeechPanel {...props} onNodeSelect={onNodeSelect} onTextChanged={onTextChange} curLibraryNode={curNode} libraries={libs}></NTKSpeechPanel>
  );
};

const NTKSpeechPanelContainer = connect<SpeechState, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(NTKSpeechPanelWrapper);
export default NTKSpeechPanelContainer;
