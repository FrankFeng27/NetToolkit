
import {IUserPasswordResult} from "../dataaccessor/dataaccessor";
import { IDatabaseAccessor } from "../dataaccessor/datainterfaces";

async function _make_sure_connected(db, cu) {
    if (db.isConnected()) {
        return true;
    }
    try {
        await db.connect();
        return true;
    } catch (err) {
        cu.handleError(err);
        return false;
    }
}

export interface IUserLogin {
    isUserNameExisted(name: string): Promise<boolean>;
    isEmailExisted(email: string): Promise<boolean>;
    isUserLoggedIn(user: string | null, pwd: string | null) : Promise<boolean>;
    signUp(name: string, email: string, pwd: string) : Promise<IUserPasswordResult>;
    signIn(name: string, pwd: string) : Promise<IUserPasswordResult>;
}

class UserLogin implements IUserLogin {
    dataAccessor: IDatabaseAccessor;
    commUtils : any;
    constructor(db: IDatabaseAccessor, comm_utils: any) {
        this.dataAccessor = db || null;
        this.commUtils = comm_utils;
    }
    isUserLoggedIn(user : string | null, pwd: string | null) : Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (!this.dataAccessor || !user || user.length === 0 || !pwd || pwd.length === 0) {
                resolve(false);
                return;
            }
            this.dataAccessor.isUserValid(user, pwd).then(valid => {
                resolve(valid);
            }).catch (err => {
                if (reject && typeof reject === 'function') {
                    reject(err);
                }
            })
        });
    }
    async isUserNameExisted(user: string): Promise<boolean> {
        let existed = await this.dataAccessor?.isUserExisted(user);
        return existed;
    }
    async isEmailExisted(email: string): Promise<boolean> {
        let existed = await this.dataAccessor?.isEmailExisted(email);
        return existed;
    }
    async signUp(name: string, email: string, pwd: string): Promise<IUserPasswordResult> {
        let res = await _make_sure_connected(this.dataAccessor, this.commUtils);
        if (!res) { return {name: name, password: null, result: false}; }
        try {
            let record = await this.dataAccessor.addUser(name, email, pwd);
            return record;
        } catch (err) {
            this.commUtils.handleError(err);
            return {name: name, password: null, result: false}; 
        }

    }
    async signIn(name: string, pwd: string) : Promise<IUserPasswordResult> {
        let ret_record = {name: name, password: null, result: false};
        try {            
            let res = await _make_sure_connected(this.dataAccessor, this.commUtils);
            if (!res) {return ret_record;}            
            return await this.dataAccessor.isUserPasswordValid(name, pwd);
        } catch (err) {
            this.commUtils.handleError(err);
            return ret_record;
        }
    }
}

/// module.exports = UserLogin;
/// export = UserLogin;
export default UserLogin;