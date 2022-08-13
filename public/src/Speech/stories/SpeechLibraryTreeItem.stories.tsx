import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { SpeechLibraryTreeItem } from "../SpeechLibraryTreeItem";

export default {
  title: "SpeechLibraryTreeItem",
  component: SpeechLibraryTreeItem,
  argTypes: {
  },
} as ComponentMeta<typeof SpeechLibraryTreeItem>;

const Template: ComponentStory<typeof SpeechLibraryTreeItem> = (args) => <SpeechLibraryTreeItem {...args} />;

export const SpeechLibraryTreeItem1 = Template.bind({});
SpeechLibraryTreeItem1.args = {
  label: "Tree Item demo 1",
  onLabelTextChanged: (v: string) => (console.log(v)),
  nodeId: {libraryId: "1", name: "/balahbalah"},
  curNodeId: {libraryId: "1", name: "/balahbalah"},
};