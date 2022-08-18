import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { SpeechLibraryTree, SpeechLibraryTreeProps } from "../SpeechLibraryTree";
import { CurrentSpeechLibraryNodeId } from "../../dataprovider/data-types";
import { getLibraryNodeIdFromTreeNodeId } from "../SpeechUtils";

const SpeechLibraryTreeWrapper: React.FC<SpeechLibraryTreeProps> = (props: SpeechLibraryTreeProps) => {
  const [selectId, setSelectId] = React.useState<CurrentSpeechLibraryNodeId | undefined>(props.curLibraryNodeId);
  function onNodeSelect(nodeId: string) {
    const id = getLibraryNodeIdFromTreeNodeId(nodeId);
    setSelectId(id);
  }
  return (<SpeechLibraryTree {...props} curLibraryNodeId={selectId} onNodeSelect={onNodeSelect} />);
};

export default {
  title: "SpeechLibraryTree",
  component: SpeechLibraryTree,
  argTypes: {},
} as ComponentMeta<typeof SpeechLibraryTree>;

const Template: ComponentStory<typeof SpeechLibraryTree> = (args) => <SpeechLibraryTree {...args} />;

export const SpeechLibraryTree1 = Template.bind({});
SpeechLibraryTree1.args = {
  libraries: [{
    id: 1, name: "/memos/2022/january", content: "balahbalah", userName: "test", configuration: ""
  }, {
    id: 2, name: "/memos/2022/feburary", content: "balahbalah", userName: "test", configuration: ""
  }, {
    id: 3, name: "/notes/quick notes", content: "balahbalah", userName: "test", configuration: ""
  }, {
    id: 4, name: "/notes/blogs/january", content: "balahbalah", userName: "test", configuration: ""
  }, {
    id: 5, name: "/notes/blogs/july", content: "balahbalah", userName: "test", configuration: ""
  }],
  curLibraryNode: {
    name: "/memos",
  },
  onNodeSelect: (nodeId: string) => (console.log(`node ${nodeId} selected`)),
  onNodeRename: (nodeId: CurrentSpeechLibraryNodeId, v: string) => (console.log(`node ${nodeId.name ?? nodeId.libraryId} was renamed to ${v}`)),
  onNodeRemove: (nodeId: CurrentSpeechLibraryNodeId) => (console.log(`${nodeId.name ?? nodeId.libraryId} was removed`))
};
