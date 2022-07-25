import { CurrentSpeechLibraryNodeId, SpeechLibraryItem, SpeechLibraryTreeNode } from "../dataprovider/data-types";

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
    static getSpeechLibaryDisplayName(name: string): string {
      const ix = name.lastIndexOf("/");
      return name.substring(ix+1);
    }
    static buildTreeItemId(node: SpeechLibraryTreeNode): string {
      return node.libraryId ? `node-${node.libraryId}` : `node-${node.name}`;
    }
    static getLibraryNodeIdFromTreeNodeId(nodeId: string): CurrentSpeechLibraryNodeId {
      const id = nodeId.slice(5);
      return Number(id) === NaN ? {name: id} : {libraryId: id};
    }
    static getCurrentLibraryNodeByLibraryNodeId(id: CurrentSpeechLibraryNodeId, libs: SpeechLibraryItem[]): SpeechLibraryTreeNode {
      if (id.libraryId) {
        for (var lib of libs) {
          const libraryId = Number(id.libraryId);
          if (libraryId === lib.id) {
            return {
                libraryId: id.libraryId,
                name: lib.name,
                content: lib.content,
                configuration: lib.configuration,
                displayName: this.getSpeechLibaryDisplayName(lib.name)
            };
          }
        }
      } else {
        return {
            name: id.name,
            displayName: this.getSpeechLibaryDisplayName(id.name),
        };
      }
    }
}

export default utils;
