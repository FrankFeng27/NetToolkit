import { CurrentSpeechLibrary, CurrentSpeechLibraryNodeId, SpeechLibraryItem, SpeechLibraryTreeNode } from "../dataprovider/data-types";

export const getSpeechLibaryDisplayName = (name: string): string => {
  const ix = name.lastIndexOf("/");
  return name.substring(ix+1);
};
const separator = "*$*"
export const buildTreeItemId = (node: CurrentSpeechLibrary): string => {
  return node.id !== undefined ? `node${separator}${node.id}${separator}${node.name}` : `node${separator}${node.name}`;
}

export const buildTreeItemIdByNodeId = (nodeId: CurrentSpeechLibraryNodeId): string => (
  nodeId.libraryId ? `node${separator}${nodeId.libraryId}${separator}${nodeId.name}` : `node${separator}${nodeId.name}`
);
export const getLibraryNodeIdFromTreeNodeId = (nodeId: string): CurrentSpeechLibraryNodeId => {
  const arr = nodeId.split(separator);
  return arr.length === 3 ? {libraryId: arr[1], name: arr[2]} : {name: arr[1]};
}
export const getLibraryNodeIdFromTreeNode = (node: SpeechLibraryTreeNode): CurrentSpeechLibraryNodeId => (
  node.libraryId ? {libraryId: node.libraryId, name: node.name} : {name: node.name}
);
export const getLibraryNodeIdFromCurrentLibrary = (lib: CurrentSpeechLibrary): CurrentSpeechLibraryNodeId => (
  lib.id !== undefined ? {libraryId: lib.id.toString(), name: lib.name} : {name: lib.name}
);
export const getCurrentLibraryNodeByLibraryNodeId = 
(id: CurrentSpeechLibraryNodeId, libs: SpeechLibraryItem[]): CurrentSpeechLibrary => {
  if (id.libraryId) {
    for (var lib of libs) {
      const libraryId = Number(id.libraryId);
      if (libraryId === lib.id) {
        return {
            id: Number(id.libraryId),
            name: lib.name,
            content: lib.content,
            configuration: lib.configuration,
            displayName: getSpeechLibaryDisplayName(lib.name)
        };
      }
    }
  } else {
    return {
        name: id.name,
        displayName: getSpeechLibaryDisplayName(id.name),
    };
  }
}

export const createLibraryTreePathNode = (arr: SpeechLibraryTreeNode[], paths: string[]): SpeechLibraryTreeNode[] => {
  let children = arr;
  let ix = 0;
  while (ix < paths.length) {
    if (paths[ix].length === 0) { // root
      ix++;
      continue;
    }
    // check if node has been existed
    const nodeName = paths.slice(0, ix+1).join("/");
    if (children.length === 0) {
      children.push({name: nodeName, displayName: paths[ix], children: []});
      children = children[0].children;
    } else {
      let found: SpeechLibraryTreeNode | undefined;
      for (let node of children) {
        if (node.name === nodeName) {
          found = node;
          break;
        }
      }
      if (found) {
        children = found.children;
      } else {
        children.push({name: nodeName, displayName: paths[ix], children: []});
        children = children[children.length-1].children;
      }
    }
    ix++;
  }
  return children;
};

export const createLibraryTreeNode = (arr: SpeechLibraryTreeNode[], lib: SpeechLibraryItem) => {
  const name = lib.name;
  const paths = name.split('/');
  let children = createLibraryTreePathNode(arr, paths.slice(0, -1));
  
  const node = children.find(v => (v.name === lib.name));
  if (!node) {
    children.push({
      name: lib.name, 
      libraryId: lib.id.toString(), 
      displayName: paths[paths.length-1], 
      content: lib.content,
      configuration: lib.configuration,
    });
  }
}

export const createLibraryTree = (libs?: SpeechLibraryItem[]): SpeechLibraryTreeNode[] => {
  if (!libs || libs.length === 0) {
    return [];
  }
  let arr: SpeechLibraryTreeNode[] = [];
  for (let lib of libs) {
    createLibraryTreeNode(arr, lib);
  }
  return arr;
}
  
export const areCurrentLibraryNodeIdsEqual = (id1: CurrentSpeechLibraryNodeId, id2: CurrentSpeechLibraryNodeId): boolean => (
  (id1.libraryId && id1.libraryId === id2.libraryId)
  || (id1.name && id1.name === id2.name)
);
export const areTwoLibrariesSame 
= (id: CurrentSpeechLibraryNodeId, lib: CurrentSpeechLibrary) => (id.libraryId ? id.libraryId === lib.id.toString() : id.name === lib.name);

export const updateLibraries = (libs: SpeechLibraryItem[], updatedLib: SpeechLibraryItem): Array<SpeechLibraryItem> => {
  const updatedLibraries: SpeechLibraryItem[] = libs.map(lib => (updatedLib.id && updatedLib.id === lib.id ? {...updatedLib} : {...lib}));
  return updatedLibraries;
}