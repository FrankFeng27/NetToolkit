import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { AddSpeechLibraryDialog, AddSpeechLibraryDialogProps } from "../AddSpeechLibraryDialog";

const AddSpeechLibraryDialogWrapper: React.FC<AddSpeechLibraryDialogProps> = (props: AddSpeechLibraryDialogProps) => {
  
  return (
    <AddSpeechLibraryDialog {...props} />
  )
};

export default {
  title: "AddSpeechLibraryDialog",
  component: AddSpeechLibraryDialog,
  argTypes: {},
} as ComponentMeta<typeof AddSpeechLibraryDialog>;

const Template: ComponentStory<typeof AddSpeechLibraryDialog> = (args) => <AddSpeechLibraryDialog {...args} />;
export const AddSpeechLibraryDialog1 = Template.bind({});
let open1 = true;
AddSpeechLibraryDialog1.args = {
  open: open1,
  onAddLibrary: (_name: string) => {},
  onAuditLibraryName: (_name: string) => (true),
  onCloseDialog: () => (open1 = false)
};
