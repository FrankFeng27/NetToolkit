
import axios from 'axios';
import { SpeechLibraryItem } from './data-types';
import DataStorage from './datastorage';

export enum ErrorStatus {
    eOK = 0,
    eInvalidName = 5000,
    eInvalidePwd = 5001,
}

export class DataAccessor {
    static isLoggedIn() : Promise<any> {
        return new Promise((resolve, reject) => {
            axios.get('/api/v1/signInStatus').then((res) => {
                resolve(res?.data?.isLoggedIn);
            }).catch((err) => {
                if (typeof reject === 'function') {
                    reject(err);
                }
            });
        });
    }
    static async signIn(name: string, pwd: string): Promise<boolean> {
        const res = await axios.post('/api/v1/signIn', {user: name, pwd});
        return res.status === 200;
    }
    static async signUp(name: string, email: string, pwd: string): Promise<boolean> {
        const res = await axios.post('/api/v1/signUp', {user: name, email, pwd});
        return res.status === 200;
    }
    static async signOut(): Promise<boolean> {
        const res = await axios.post('/api/v1/signOut');
        return res.status === 200;
    }
    static async getMemos(): Promise<any> {
      const res = await axios.get('/api/v1/memos');
      return res.status === 200;
    }
    static async getSpeechLibraries(): Promise<any> {
      const res = await axios.get('/api/v1/speechLibraries');
      return res;
    }
    static async removeSpeechLibrary(libraryId: string): Promise<boolean> {
      const res = await axios.delete(`/api/v1/speechLibrary/${libraryId}`);
      return res.status === 200;
    }
    static async addSpeechLibrary(name: string, content: string, configuration: string) {
      const res = await axios.post('/api/v1/speechLibrary', {name, content, configuration});
      return res;
    }
    static async updateSpeechLibrary(id: string, name: string, content: string, configuration: string) {
      const res = await axios.post('/api/v1/speechLibrary', {id, name, content, configuration});
    }
    static async getSpeechLibrary(libraryId: string): Promise<any> {
        const res = await axios.get(`/api/v1/speechLibrary?libraryId=${libraryId}`);
        return res;
    }
    static async renameSpeechLibraries(libs: Array<{id: number, name: string}>) {
        const res = await axios.post('/api/v1/speechLibraries/rename', {libraries: libs});
        return res;
    }
}

export class DataProvider {
    private storage: DataStorage = new DataStorage();

    set UserName(name: string) {
        this.storage.user = name;
    }
    get UserName() {
        return this.storage.user;
    }
    set SpeechLibraries(libs: SpeechLibraryItem[]) {
        this.storage.SpeechLibraries = libs;
    }
    get SpeechLibraries() {
        return this.storage.SpeechLibraries;
    }
    set CurrentSpeechLibrary(lib: SpeechLibraryItem) {
        this.storage.CurrentSpeechLibrary = lib;
    }
    get CurrentSpeechLibrary() {
        return this.storage.CurrentSpeechLibrary;
    }
}




