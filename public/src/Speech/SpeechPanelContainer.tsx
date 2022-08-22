import * as React from "react";
import { useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { setSpeechText } from "../actions";
import { CurrentSpeechLibrary, CurrentSpeechLibraryNodeId, RootState } from "../dataprovider/data-types";
import { AppDispatch } from "../store";
import NTKSpeechPanel, { NTKSpeechPanelProps } from "./SpeechPanel";
import { addLibraryAsCurrent, getLibraries, getLibraryForCurLibraryNode, setCurrentLibraryNode, SpeechState, updateCurrentLibrary } from "./SpeechSlice";
import * as SpeechUtils from "./SpeechUtils";

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

const NTKSpeechPanelWrapper: React.FC<NTKSpeechPanelProps> = (props: NTKSpeechPanelProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const speechState = useSelector((state: RootState) => (
    state.speeches
  ));
  const libraries = speechState.libraries ?? [];
  const curNode = speechState.currentSpeechLibrary;
  const curLibrary: CurrentSpeechLibrary | undefined = curNode ? {...curNode} : undefined;
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
  function onLibrarySelect(curId: CurrentSpeechLibraryNodeId) {
    if (props.currentLibrary 
      && SpeechUtils.areCurrentLibraryNodeIdsEqual(curId, (props.currentLibrary as CurrentSpeechLibraryNodeId))) {
      return;
    }
    const curNode = SpeechUtils.getCurrentLibraryNodeByLibraryNodeId(curId, libraries);
    dispatch(setCurrentLibraryNode(curNode));
    if (curNode.libraryId) {
      dispatch(getLibraryForCurLibraryNode(curId.libraryId));
    }
  }
  function onAddLibrary(name: string) {
    dispatch(addLibraryAsCurrent({name: name, content: "", configuration: "{}"}));
  }

  const libs = [...libraries];
  return (
    <NTKSpeechPanel {...props} onAddLibrary={onAddLibrary} onTextChanged={onTextChange} libraries={libs} currentLibrary={curLibrary} onLibrarySelect={onLibrarySelect} />
  );
};

const NTKSpeechPanelContainer = connect<SpeechState, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(NTKSpeechPanelWrapper);
export default NTKSpeechPanelContainer;
