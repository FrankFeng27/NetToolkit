import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { TreeItem, TreeView } from "@mui/lab";
import { ChevronRight, ExpandMore } from "@mui/icons-material";

import { SpeechLibraryTreeItem } from "../SpeechLibraryTreeItem";
import { TreeItemContentComponent } from "../TreeItemContentComponent";

const SpeechLibraryTreeView: React.FC = () => {
  const selected = "node-1";
  function onNodeSelect() {}
  function onLabelTextChanged() {}
  return (
    <TreeView
      aria-label="rich object"
      defaultCollapseIcon={<ExpandMore />}
      defaultExpandIcon={<ChevronRight />}
      selected={selected}
      onNodeSelect={onNodeSelect}
      sx={{ fontSize: 'inherit', minHeight: 110, flexGrow: 1, maxWidth: 400, overflowY: 'auto', overflowX: 'clip' }}
    >
      <TreeItem nodeId="node-/memos" ContentComponent={TreeItemContentComponent} 
      ContentProps={{labelText: "memos", id: "node-/memos", currentId: "node-/memos", onLabelChanged: ()=>{}} as any}>
        <TreeItem nodeId="node-/memos/2022" ContentComponent={TreeItemContentComponent} 
        ContentProps={{labelText: "2022", id:"node-/memos/2022", currentId:"node-/memos", onLabelChanged: ()=>{}} as any}></TreeItem>
      </TreeItem>
    </TreeView>
  );
};


export default {
  title: "SpeechLibraryTreeView",
  component: SpeechLibraryTreeView,
  argTypes: {
  },
} as ComponentMeta<typeof SpeechLibraryTreeView>;

const Template: ComponentStory<typeof SpeechLibraryTreeView> = (args) => <SpeechLibraryTreeView {...args} />;

export const SpeechLibraryTreeItem1 = Template.bind({});
