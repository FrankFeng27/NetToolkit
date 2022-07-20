
let assert = require('assert');
import DataAccessor, { IUserPasswordResult } from "../server/plugins/dataaccessor/dataaccessor";

let host = "localhost";
let port = 3306;
let user = "fengsh";
let password = "!23456fF";
let database = "testDB";
let timeout = 1000;
let sqliteFolder = "./";

class MockConfig {
    dict = {"database": {host, port, user, password, database, timeout, sqliteFolder}};
    get(key: string) {
      return this.dict[key];
    }
    set(key: string, val: any) {
      this.dict[key] = val;
    }
}

class MockCommUtils {
    static delimiter = "-+=";
    encryptWithSalt(pwd: string, salt: string, delimiter: string): string {
        return `${pwd}${delimiter}${salt}`;
    }
    encryptWithRandomSalt(pwd: string, version: string) {
        let salt = "random";
        return {crypto: this.encryptWithSalt(pwd, salt, MockCommUtils.delimiter), salt, delimiter: MockCommUtils.delimiter, version};
    }
    handleError(err: Error) {
      console.log(err);
    }
}

describe('DataAccessor', () => {
    let accessor: DataAccessor | undefined;
    before(async () => {
        accessor = new DataAccessor({config: new MockConfig(), commUtils: new MockCommUtils()});
        let is_connect = accessor?.isConnected();
        if (is_connect) {
            return;
        } else {
            await accessor.connect();
        }
    });
    after(async () => {
	await accessor.dropTables();
        accessor.disconnect();
    });

    it("should test isUserPasswordValid", async () => {
        try {
            let res = await accessor.isUserPasswordValid("invalid", "nopassword");
            assert(!res.result);
        } catch (err) {
            console.log(err);
        }
    });
    it("should test getUserPassword", async () => {
        let existed = await accessor.isUserExisted("dataaccessor.spec.testUser");
        if (!existed) {
            let res: IUserPasswordResult = await accessor.addUser("dataaccessor.spec.testUser", "testUser@xxx.com", "checkpassword");
            assert(res !== null && res.result);
        }
        let pwd = await accessor.getUserPassword("dataaccessor.spec.testUser");
        assert(pwd === null || typeof(pwd) === 'string');
    });
});



