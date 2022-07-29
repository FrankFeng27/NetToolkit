import { SpeechLibraryItem } from "./data-types";

class DataStorage {
  private mUserName: string | undefined;
  private mSpeechLibraries: SpeechLibraryItem[] | undefined;
  private mCurSpeechLibrary: SpeechLibraryItem | undefined;

  constructor() {}

  get user(): string | undefined {
    return this.mUserName;
  }
  set user(v: string) {
    this.mUserName = v;
  }
  get SpeechLibraries(): SpeechLibraryItem[] | undefined {
    return this.mSpeechLibraries;
  }
  set SpeechLibraries(v: SpeechLibraryItem[]) {
    this.mSpeechLibraries = v;
  }
  get CurrentSpeechLibrary(): SpeechLibraryItem | undefined {
    return this.mCurSpeechLibrary;
  }
  set CurrentSpeechLibrary(v: SpeechLibraryItem) {
    this.mCurSpeechLibrary = v;
  }
}

export default DataStorage;
