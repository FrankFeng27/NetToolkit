import * as React from "react";
import styled from "styled-components";
import { ExpandMore as ExpandMoreIcon, ChevronRight as ChevronRightIcon} from "@mui/icons-material";
import { styled as muiStyled } from "@mui/material/styles";
import { TreeView, TreeItem, treeItemClasses } from "@mui/lab";
import { SpeechLibraryItem, SpeechLibraryTreeNode } from "../dataprovider/data-types";

const SideNavbarContainer = styled.div`
  width: 120px;
  min-width: 120px;
  flex-grow: 0;
  display:flex;
  flex-direction: column;
  padding: 20px 10px;
`;
const SideNavItem = styled.div`
  font-size: 12px;
  font-family: Arial;
  display: flex;
  flex-direction: row;
  margin: 5px;
  align-items: center;
`;
const LibraryTreeContainer = styled.div`
  flex-grow: 10;
  display: flex;
  flex-direction: column;
`;
const LibrariesLabel = styled.div`
  flex-grow: 0;
`;

const StyledTreeItemRoot = muiStyled(TreeItem)(( {theme} ) => ({
  [`.${treeItemClasses.content} .${treeItemClasses.label}`]: {
    fontSize: 12,
  },
  [`& .${treeItemClasses.label}`]: {
    fontSize: 12,
  }
}));


const createLibraryTreePathNode = (arr: SpeechLibraryTreeNode[], paths: string[]): SpeechLibraryTreeNode[] => {
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

const createLibraryTreeNode = (arr: SpeechLibraryTreeNode[], lib: SpeechLibraryItem) => {
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

const createLibraryTree = (libs?: SpeechLibraryItem[]): SpeechLibraryTreeNode[] => {
  if (!libs || libs.length === 0) {
    return [];
  }
  let arr: SpeechLibraryTreeNode[] = [];
  for (let lib of libs) {
    createLibraryTreeNode(arr, lib);
  }
  return arr;
}

const createLibraryWidget = (node: SpeechLibraryTreeNode) => {
  const id = node.libraryId ? `node-${node.libraryId}` : `node-${node.name}`;
  return (<StyledTreeItemRoot key={id} nodeId={id} label={node.displayName}>
    {(node.children && node.children.length > 0) ? node.children.map(n => createLibraryWidget(n)) : null}
  </StyledTreeItemRoot>)
};

const createLibraryWidgets = (libs?: SpeechLibraryItem[]) => {
  const arr = createLibraryTree(libs);
  return (<LibraryTreeContainer>
    <LibrariesLabel>Libraries</LibrariesLabel>
    <TreeView
      aria-label="rich object"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpanded={['root']}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{ fontSize: 'inherit', minHeight: 110, flexGrow: 1, maxWidth: 400, overflowY: 'auto', overflowX: 'clip' }}
    >
    {(arr && arr.length > 0) ? arr.map(n => (createLibraryWidget(n))) : null}
    </TreeView>
  </LibraryTreeContainer>);
};

export interface NTKSpeechSideNavProps {
  libraries?: SpeechLibraryItem[];
}

export const NTKSpeechSideNav: React.FC<NTKSpeechSideNavProps> = (props: NTKSpeechSideNavProps) => {
  return (
    <SideNavbarContainer>
      <SideNavItem>Add Library ...</SideNavItem>
      <SideNavItem>
        {createLibraryWidgets(props.libraries)}
      </SideNavItem>
    </SideNavbarContainer>
  );
};
