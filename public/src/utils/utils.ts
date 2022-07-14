
export interface PathItem {
  name: string; // presents path, like "/2022-6-27/typescript/thoughts" means 2022-6-27>typescript>thoughts
}
export interface PathTreeItem {
  name: string;
  node?: any;
}

class utils {
    static isInteger(n : any) : boolean {
        if ( Number.isInteger(n) ) {
            return true;
        }
        // As Number(n) will convert "" to 0, we need avoid the case
        if (typeof n === 'string' && n.length === 0) {
            return false;
        }
        const temp = Number(n);
        if (isNaN(temp) || !Number.isInteger(temp)) {
            return false;
        }
        return true;
    }

    static isString(n : any) : boolean {
        return typeof n === 'string';
    }

    static toInteger(n : any) : number {
        if (!this.isInteger(n)) {
            return 0;
        }
        return Number(n);
    }

}

export default utils;
