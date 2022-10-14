import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { NTKWordMemorizingPanel } from "../WordMemorizingPanel";

export default {
  title: "WordMemorizingPanel",
  component: NTKWordMemorizingPanel,
  argTypes: {}
} as ComponentMeta<typeof NTKWordMemorizingPanel>;

const Template: ComponentStory<typeof NTKWordMemorizingPanel> = (args) => <NTKWordMemorizingPanel {...args} />;

export const NTKWordMemorizingPanel1 = Template.bind({});
NTKWordMemorizingPanel1.args = {
  isLoggedIn: true,
  onOpenSignInDlg: () => {},
  onOpenSignUpDlg: () => {}
};

export const NTKWordMemorizingPanel2 = Template.bind({});
NTKWordMemorizingPanel2.args = {
  isLoggedIn: false,
  onOpenSignInDlg: () => {},
  onOpenSignUpDlg: () => {}
};
