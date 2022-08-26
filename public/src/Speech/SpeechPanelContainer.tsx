import * as React from "react";
import { useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { setSpeechText } from "../actions";
import { CurrentSpeechLibrary, CurrentSpeechLibraryNodeId, RootState } from "../dataprovider/data-types";
import { AppDispatch } from "../store";
import NTKSpeechPanel, { NTKSpeechPanelProps } from "./SpeechPanel";
import { addLibraryAsCurrent, getLibraries, getLibraryForCurLibraryNode, renameCurrentLibrary, setCurrentLibraryNode, SpeechState, updateCurrentLibrary } from "./SpeechSlice";
import * as SpeechUtils from "./SpeechUtils";

interface NTKSpeechPanelWrapperProps {
  isLoggedIn: boolean;
  onOpenSignInDlg: () => void;
  onOpenSignUpDlg: () => void;
}

const NTKSpeechPanelContainer: React.FC<NTKSpeechPanelWrapperProps> = (props: NTKSpeechPanelWrapperProps) => {
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
      dispatch(updateCurrentLibrary({id: curNode.id, content: text,
        name: curNode.name, configuration: curNode.configuration}));
    }
  }
  function onLibrarySelect(curId: CurrentSpeechLibraryNodeId) {
    if (curLibrary 
      && SpeechUtils.areCurrentLibraryNodeIdsEqual(curId, curLibrary.id !== undefined ? {libraryId: curLibrary.id.toString(), name: curLibrary.name} 
      : {name: curLibrary.name})) {
      return;
    }
    const curNode = SpeechUtils.getCurrentLibraryNodeByLibraryNodeId(curId, libraries);
    dispatch(setCurrentLibraryNode(curNode));
    if (curNode.id !== undefined) {
      dispatch(getLibraryForCurLibraryNode(curId.libraryId));
    }
  }
  function onAddLibrary(name: string) {
    dispatch(addLibraryAsCurrent({name: name, content: "", configuration: "{}"}));
  }
  function onRenameCurrentLibrary(id: CurrentSpeechLibraryNodeId, newName: string) {
    const renameStruct = (id.libraryId !== undefined ? {library: {id: Number(id.libraryId), name: id.name}, name: newName, libraries}
    : {library: {name: id.name}, name: newName, libraries});
    dispatch(renameCurrentLibrary(renameStruct));
  }
  function onRemoveCurrentLibrary(id: CurrentSpeechLibraryNodeId) {}

  const libs = [...libraries];
  return (
    <NTKSpeechPanel 
    {...props} 
    onAddLibrary={onAddLibrary} 
    onTextChanged={onTextChange} 
    libraries={libs} 
    currentLibrary={curLibrary} 
    onLibrarySelect={onLibrarySelect} 
    onRenameLibrary={onRenameCurrentLibrary}
    onRemoveLibrary={onRemoveCurrentLibrary}
    />
  );
};

export default NTKSpeechPanelContainer;
