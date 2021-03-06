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
  content: string,
  userName?: string,
  configuration: string
}
export interface SpeechLibraryTreeNode {
  name: string;
  libraryId?: string;
  displayName: string;
  content?: string;
  children?: SpeechLibraryTreeNode[];
  configuration?: string;
}

export interface RootState {
  speeches: SpeechState;
}
