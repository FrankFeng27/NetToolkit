import * as React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { CurrentSpeechLibrary, CurrentSpeechLibraryNodeId, RootState } from "../dataprovider/data-types";
import { AppDispatch } from "../store";
import { SpeechConfirmDialog } from "./SpeechConfirmDialog";
import NTKSpeechPanel from "./SpeechPanel";
import {
  addLibraryAsCurrent, 
  getLibraries, 
  getLibraryForCurLibraryNode, 
  removeCurrentLibrary, 
  renameCurrentLibrary, 
  setCurrentLibraryNode,
   updateCurrentLibraryContent 
} from "./SpeechSlice";
import * as SpeechUtils from "./SpeechUtils";

const StyledSpeechPanelContainer = styled.div `
  height: 100%;
`;

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
  const [openRmConfirmDlg, setOpenRmConfirmDlg] = React.useState(false);
  const [libIdToRemove, setLibIdToRemove] = React.useState<CurrentSpeechLibraryNodeId|undefined>(undefined);
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
      dispatch(updateCurrentLibraryContent({
        id: curNode.id, 
        content: text,
        name: curNode.name, 
        configuration: curNode.configuration
      }));
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
  function onRemoveCurrentLibrary(id: CurrentSpeechLibraryNodeId) {
    /// dispatch(removeCurrentLibrary({id, libraries}));
    setLibIdToRemove(id);
    setOpenRmConfirmDlg(true);
  }
  function onOKToConfirmRemoveLibrary(userData: any) {
    setOpenRmConfirmDlg(false);
    if (userData === undefined) {
      return;
    }
    const id = userData as CurrentSpeechLibraryNodeId;
    dispatch(removeCurrentLibrary({id, libraries}));
  }
  function onCancelConfirmRemoveLibrary() {
    setOpenRmConfirmDlg(false);
  }

  console.log(`libraries: ${libraries}`);
  const libs = libraries !== undefined ? [...libraries] : [];
  return (
    <StyledSpeechPanelContainer>
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
    <SpeechConfirmDialog
    open={openRmConfirmDlg} 
    title="Remove Library" 
    text="Are you sure to delete the library permanently?" 
    userData={libIdToRemove}
    onOKCallback={onOKToConfirmRemoveLibrary}
    onCancelCallback={onCancelConfirmRemoveLibrary}
    />
    </StyledSpeechPanelContainer>
  );
};

export default NTKSpeechPanelContainer;
