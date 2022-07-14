import { IUserPasswordResult } from "./dataaccessor";


export interface IMemoRecord {
  id: number;
  notebook: string;
  note: string;
  createdTime: string; // "YY-mm-dd HH:MM:SS"
  modifiedTime: string; // "YY-mm-dd HH:MM:SS"
  memo: string;
  uid: number;
}
export interface IUserRecord {
    id: number;
    name: string;
    password: string;
    pwdsalt: string;
    delimiter: string;
    version: string;
}
export interface ISpeechLibraryRecord {
  id: number,
  name: string,
  content: string,
  userName: string,
  configuration: string
}
export interface IDatabase {
    isConnected(): boolean;
    connect(host: string, port: number, user: string, pwd: string, dbname: string, timeout: number, xdata?: any): Promise<void>;
    disconnect(): Promise<void>;
    createUserTableIfNotExisted(): Promise<boolean>;
    createMemoTableIfNotExisted(): Promise<boolean>;
    createSpeechTablesIfNotExisted(): Promise<boolean>;
    dropSpeechTables(): Promise<void>;
    dropMemoTable(): Promise<void>;
    dropUserTable(): Promise<void>;
    addUser(name: string, email: string | null, pwd: string, pwdsalt: string, delimiter: string, version: string): Promise<IUserRecord>;
    getUser(name: string): Promise<IUserRecord>;
    getEmail(email: string): Promise<IUserRecord>;
    removeUser(name: string, pwd: string): Promise<boolean>;
    isUserExisted(name: string): Promise<boolean>;
    isUserNameValid(name: string, pwdSalted: string): Promise<boolean>;
    addMemo(notebook: string, note: string, memo: string, user: string): Promise<IMemoRecord>;
    updateMemo(notebook: string, note: string, memo: string, user: string): Promise<boolean>;
    removeMemo(memoId: number, user: string): Promise<boolean>;
    getMemos(user: string): Promise<IMemoRecord[]>;
    addSpeechLibrary(name: string, content: string, user: string, configuration: string): Promise<ISpeechLibraryRecord>;
    removeSpeechLibrary(id: number): Promise<boolean>;
    getSpeechLibraries(user: string): Promise<Array<ISpeechLibraryRecord>>;
}

export interface IDatabaseAccessor {
    isConnected(): boolean;
    connect(): Promise<boolean>;
    disconnect(): any;
    dropTables(): Promise<void>;
    isUserExisted(name: string): Promise<boolean>;
    isEmailExisted(email: string): Promise<boolean>;
    isUserValid(name: string, pwdSalted: string): Promise<boolean>;
    isUserPasswordValid(name: string, pwd: string): Promise<IUserPasswordResult>;
    addUser(name: string, email: string, pwd: string): Promise<IUserPasswordResult>;
    getUserPassword(name: string): Promise<string | null>;
    removeUser(name: string, pwd: string): Promise<any>;
    addMemo(usr: string, notebook: string, note: string, memo: string): Promise<boolean>;
    removeMemo(memo_id: number, user: string): Promise<boolean>;
    updateMemo(notebook: string, note: string, memo: string, user: string): Promise<boolean>;
    getMemos(name: string): Promise<IMemoRecord[]>;
    addSpeechLibrary(name: string, content: string, user: string, configuration: string): Promise<ISpeechLibraryRecord>;
    removeSpeechLibrary(id: number): Promise<boolean>;
    getSpeechLibraries(user: string): Promise<Array<ISpeechLibraryRecord>>;
}
export const emptyUser: IUserRecord = {id: -1, name: "", password: "", pwdsalt: "", delimiter: "", version: ""};
export const emptyMemo: IMemoRecord = {id: -1, uid: -1, notebook: "", note: "", memo: "", createdTime: "1970-01-01", modifiedTime: "1970-01-01"};
export const emptySpeechLibrary: ISpeechLibraryRecord = {
  id: -1,
  name: "",
  content: "",
  configuration: "{}",
  userName: ""
};
