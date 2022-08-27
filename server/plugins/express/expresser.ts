
"use strict";

import {IUserLogin} from "../login/userlogin";
import { emptySpeechLibrary, IDatabaseAccessor, IMemoRecord, ISpeechLibraryRecord } from "../dataaccessor/datainterfaces";
import { InvalidSessionUserError } from "../datatypes/errors";
import { getRandomInt } from "../commutils/utils";

export enum LoginErrorType {
    ERROR_SUCCESS = "Success",
    ERROR_USERNAME_EXISTED = "User name already existed",
    ERROR_USERNAME_NOT_EXISTED = "User name not exist",
    ERROR_EMAIL_EXISTED = "Email already existed",
    ERROR_EMAIL_NOT_EXISTED = "Email not exist",
    ERROR_USERNAME_OR_EMAIL_NOT_EXISTED = "User name or Email not exist",
    ERROR_USERNAME_EMPTY = "User name is empty",
    ERROR_EMAIL_EMPTY = "Email is empty",
    ERROR_PASSWORD_EMPTY = "Password is empty",
    ERROR_UNKNOWN_ERROR = "Unknown error occurred",
    ERROR_INCORRECT_USERNAME_OR_PWD = "Invalid username or password",

    // Last error
    ERROR_UNKNOWN = "Unknown Error"
}

export interface IExpresser {
    isSessionUserValid(request: any): Promise<boolean>;
    signUp(request: any): Promise<LoginErrorType>;
    signIn(request: any): Promise<LoginErrorType>;
    signOut(request: any): void;
}

/**
 * Expresser will process request directly.
 */
class Expresser implements IExpresser {
    userLogin: IUserLogin;
    commUtils: any;
    dataAccessor: IDatabaseAccessor;
    constructor(user_login: IUserLogin, comm_utils: any, dataAccessor: IDatabaseAccessor) {
        this.userLogin = user_login;
        this.commUtils = comm_utils;
        this.dataAccessor = dataAccessor;
    }

    async isSessionUserValid(request: any) : Promise<boolean> {
        try {
            if (!request || !request.session || !request.session.user) {
                return false;
            }
            return await this.userLogin.isUserNameExisted(request.session.user);
        }
        catch (err) {
            this.commUtils.handleError(err);
            return false;
        }
    }
    async signUp(request): Promise<LoginErrorType> {
        if (!request.body.user) {
            return LoginErrorType.ERROR_USERNAME_EMPTY
        }
        if (!request.body.email) {
            return LoginErrorType.ERROR_EMAIL_EMPTY;
        }
        if (!request.body.pwd) {
            return LoginErrorType.ERROR_PASSWORD_EMPTY;
        }
        let user = request.body.user;
        let email = request.body.email;
        let pwd = request.body.pwd;
        const userExisted = await this.userLogin.isUserNameExisted(user)
        if (userExisted) {
            return LoginErrorType.ERROR_USERNAME_EXISTED;
        }
        const emailExisted = await this.userLogin.isEmailExisted(email);
        if (emailExisted) {
            return LoginErrorType.ERROR_EMAIL_EXISTED;
        }
        let res = await this.userLogin.signUp(user, email, pwd);
        if (res.result) {
            request.session.user = user;
            return LoginErrorType.ERROR_SUCCESS
        }
        return LoginErrorType.ERROR_UNKNOWN_ERROR;
    }
    async signIn(request): Promise<LoginErrorType> {
        if (!request.body.user || !request.body.pwd) {
            return LoginErrorType.ERROR_INCORRECT_USERNAME_OR_PWD;
        }
        const user = request.body.user;
        const pwd = request.body.pwd;
        if (user.length === 0 || pwd.length === 0) {
            return LoginErrorType.ERROR_INCORRECT_USERNAME_OR_PWD;
        }
        const userExisted = await this.userLogin.isUserNameExisted(user);
        const emailExisted = await this.userLogin.isEmailExisted(user);
        if (!userExisted && !emailExisted) {
            return LoginErrorType.ERROR_USERNAME_OR_EMAIL_NOT_EXISTED;
        }
        let res = await this.userLogin.signIn(user, pwd);
        if (res.result) {
            request.session.user = user;
            return LoginErrorType.ERROR_SUCCESS;
        }
        return LoginErrorType.ERROR_UNKNOWN_ERROR;
    }
    signOut(request) {
        request.session.user = null;
        return;
    }
    async addMemo(request): Promise<boolean> {
      try {
        const user = request.session.user;
        const memo = request.body.memo;
        const note = request.body.not;
        const notebook = request.body.notebook;
        return await this.dataAccessor.addMemo(user, notebook, note, memo);
      } catch (err) {
        this.commUtils.handle(err);
        return false;
      }
    }
    async removeMemo(request): Promise<boolean> {
      try {
        const user = request.session.user;
        const memoId = request.session.memoId;
        return await this.dataAccessor.removeMemo(memoId, user);
      } catch (err) {
        this.commUtils.handleError(err);
        return false;
      }
    }
    async updateMemo(request): Promise<boolean> {
      try {
        const user = request.session.user;
        const memo = request.body.memo;
        const note = request.body.not;
        const notebook = request.body.notebook;
        return await this.dataAccessor.updateMemo(user, notebook, note, memo);
      } catch (err) {
        this.commUtils.handle(err);
        return false;
      }
    }
    async getMemos(request): Promise<IMemoRecord[]> {
      try {
        const user = request.body.user;
        return this.dataAccessor.getMemos(user);
      } catch (err) {
        this.commUtils.handleError(err);
        return [];
      }
    }
    async addSpeechLibrary(request): Promise<ISpeechLibraryRecord> {
      try {
        const user = request.session?.user;
        if (!user) {
          this.commUtils.handleError(new InvalidSessionUserError()); 
          return emptySpeechLibrary;
        }
        const id = request.body.id as number;
        const name = request.body.name;
        const content = request.body.content;
        const configuration = request.body.configuration;

        if (id === undefined || id < 0) {
          const Max_Random = 99999999;
          const rand = getRandomInt(Max_Random);
          const libName = name.length > 0 ? name : `/temporary~${rand}`;
          return await this.dataAccessor.addSpeechLibrary(libName, content, user, configuration);
        } else {
          return await this.dataAccessor.updateSpeechLibrary(id, name, content, user, configuration);
        }
      } catch (err) {
        this.commUtils.handleError(err);
        return emptySpeechLibrary;
      }
    }
    async removeSpeechLibrary(request): Promise<boolean> {
      try {
        const user = request.session?.user;
        if (!user) {
          this.commUtils.handleError(new InvalidSessionUserError()); 
          return false;
        }
        const id = request.params.libraryId;
        return await this.dataAccessor.removeSpeechLibrary(id as number);
      } catch (err) {
        this.commUtils.handleError(err);
        return false;
      }
    }
    async removeSpeechLibraries(request): Promise<boolean> {
      try {
        const user = request.session?.user;
        if (!user) {
          this.commUtils.handleError(new InvalidSessionUserError()); 
          return false;
        }
        const ids = request.body.ids;
        return await this.dataAccessor.removeSpeechLibraries(ids as number[]);
      } catch (err) {
        this.commUtils.handleError(err);
        return false;
      }
    }
    async getSpeechLibraries(request): Promise<ISpeechLibraryRecord[]> {
      try {
        const user = request.session?.user;
        if (!user) {
          this.commUtils.handleError(new InvalidSessionUserError()); 
          return [];
        }
        const arr = await this.dataAccessor.getSpeechLibraries(user);
        return arr;
      } catch (err) {
        this.commUtils.handleError(err);
        return [];
      }
    }
    async getSpeechLibrary(request): Promise<ISpeechLibraryRecord> {
      const user = request.session?.user;
      if (!user) {
        this.commUtils.handleError(new InvalidSessionUserError()); 
        return emptySpeechLibrary;
      }
      try {
        const id = parseInt(request.query.libraryId);
        const record = await this.dataAccessor.getSpeechLibrary(id);
        return record;
      } catch (err) {
        this.commUtils.handleError(err);
        return emptySpeechLibrary;
      }
    }
    async renameSpeechLibraries(request): Promise<boolean> {
      const user = request.session?.user;
      if (!user) {
        this.commUtils.handleError(new InvalidSessionUserError()); 
        return false;
      }
      try {
        const libs = request.body.libraries;
        const res = await this.dataAccessor.renameSpeechLibraries(libs);
        return true;
      } catch (err) {
        this.commUtils.handleError(err);
        return false;
      }
    }
}

export default Expresser;

