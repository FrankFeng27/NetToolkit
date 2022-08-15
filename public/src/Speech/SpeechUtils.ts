import { CurrentSpeechLibrary, CurrentSpeechLibraryNodeId, SpeechLibraryItem, SpeechLibraryTreeNode } from "../dataprovider/data-types";

export const getSpeechLibaryDisplayName = (name: string): string => {
  const ix = name.lastIndexOf("/");
  return name.substring(ix+1);
};
export const buildTreeItemId = (node: CurrentSpeechLibrary): string => {
  return node.libraryId ? `node-${node.libraryId}` : `node-${node.name}`;
}

export const buildTreeItemIdByNodeId = (nodeId: CurrentSpeechLibraryNodeId): string => (
  nodeId.libraryId ? `node-${nodeId.libraryId}` : `node-${nodeId.name}`
);
export const getLibraryNodeIdFromTreeNodeId = (nodeId: string): CurrentSpeechLibraryNodeId => {
  const id = nodeId.slice(5);
  const numId = Number(id);
  return Number.isNaN(numId) ? {name: id} : {libraryId: id};
}
export const getLibraryNodeIdFromTreeNode = (node: SpeechLibraryTreeNode): CurrentSpeechLibraryNodeId => (
  node.libraryId ? {libraryId: node.libraryId} : {name: node.name}
);
export const getLibraryNodeIdFromCurrentLibrary = (lib: CurrentSpeechLibrary): CurrentSpeechLibraryNodeId => (
  lib.libraryId ? {libraryId: lib.libraryId} : {name: lib.name}
);
export const getCurrentLibraryNodeByLibraryNodeId = 
(id: CurrentSpeechLibraryNodeId, libs: SpeechLibraryItem[]): CurrentSpeechLibrary => {
  if (id.libraryId) {
    for (var lib of libs) {
      const libraryId = Number(id.libraryId);
      if (libraryId === lib.id) {
        return {
            libraryId: id.libraryId,
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