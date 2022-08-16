import * as React from "react";
import { useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { setSpeechText } from "../actions";
import { CurrentSpeechLibrary, CurrentSpeechLibraryNodeId, RootState } from "../dataprovider/data-types";
import { AppDispatch } from "../store";
import NTKSpeechPanel, { NTKSpeechPanelProps } from "./SpeechPanel";
import { addLibrary, getLibraries, SpeechState } from "./SpeechSlice";
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
  const dispatch = useDispatch<AppDispatch>();
  const speechState = useSelector((state: RootState) => (
    state.speeches
  ));
  const libraries = speechState.libraries ?? [];
  const curNode = speechState.currentLibraryNode;
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
      dispatch(addLibrary({name: "", content: text, configuration: "{}"}));
    }
  }
  function onLibrarySelect(curId: CurrentSpeechLibraryNodeId) {
    if (SpeechUtils.areCurrentLibraryNodeIdsEqual(curId, (props.currentLibrary as CurrentSpeechLibraryNodeId))) {
      return;
    }
    const node = SpeechUtils.getCurrentLibraryNodeByLibraryNodeId(curId, libs);
    
  }

  const libs = [...libraries];
  return (
    <NTKSpeechPanel {...props} onTextChanged={onTextChange} libraries={libs} currentLibrary={curLibrary} onLibrarySelect={onLibrarySelect} />
  );
};

const NTKSpeechPanelContainer = connect<SpeechState, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(NTKSpeechPanelWrapper);
export default NTKSpeechPanelContainer;
