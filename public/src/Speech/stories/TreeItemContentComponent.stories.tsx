import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { TreeItemContentComponent } from "../TreeItemContentComponent";

export default {
  title: "TreeItemContentComponent",
  component: TreeItemContentComponent,
  argTypes: {
  },
} as ComponentMeta<typeof TreeItemContentComponent>;

const Template: ComponentStory<typeof TreeItemContentComponent> = (args) => <TreeItemContentComponent {...args} />;

export const TreeItemContentComponent1 = Template.bind({});
TreeItemContentComponent1.args = {
  label: "label demo 1",
  onLabelChanged: (v: string) => (console.log(v)),
  id: "1",
  currentId: "1",
};