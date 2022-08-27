import { LoginState } from "../LoginDialog/LoginSlice";
import { SpeechState } from "../Speech/SpeechSlice";

export interface PanelRouteProps {
  openDrawer: boolean;
}

export enum LogInTypeEnum {
  Hide = 0,
  SignIn = 1,
  SignUp = 2,
}

export interface MemoData {
  memo: string;
  note: string;
  notebook: string;
  modifiedTime: string;
  plainText: string;
}

export interface SpeechLibraryItem {
  id?: number,
  name: string,
  displayName?: string,
  content?: string,
  userName?: string,
  configuration?: string,
  updated?: boolean;
}
export interface SpeechLibraryTreeNode {
  name: string;
  libraryId?: string;
  displayName: string;
  content?: string;
  children?: SpeechLibraryTreeNode[];
  configuration?: string;
}

export interface CurrentSpeechLibraryNodeId {
  name: string;
  libraryId?: string;
}

export interface RootState {
  speeches: SpeechState;
  login: LoginState;
}
export type CurrentSpeechLibrary = SpeechLibraryItem;
export interface SpeechRenameStruct {
  library: CurrentSpeechLibrary;
  name: string;
  libraries: SpeechLibraryItem[];
}
export interface SpeechRemoveStruct {
  id: CurrentSpeechLibraryNodeId;
  libraries: SpeechLibraryItem[];
}
