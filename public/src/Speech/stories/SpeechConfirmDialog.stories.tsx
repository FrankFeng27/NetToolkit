import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { SpeechConfirmDialog,  ISpeechConfirmDialogProps} from "../SpeechConfirmDialog";

const SpeechConfirmDialogWrapper = (props: {open: boolean}) => {
  const [open, setOpen] = React.useState(props.open);
  function onOKCallback() {
    setOpen(false);
  }
  function onCancelCallback() {
    setOpen(false);
  }
  return (
    <SpeechConfirmDialog
      open={open}
      onOKCallback={onOKCallback}
      onCancelCallback={onCancelCallback}
      userData="empty"
      title="Remove Libraries ..."
      text="Do you want to delete library permanently?"
    ></SpeechConfirmDialog>
  )
};

export default {
    title: "SpeechConfirmDialog",
    component: SpeechConfirmDialog,
    argTypes: {}
} as ComponentMeta<typeof SpeechConfirmDialogWrapper>;

const Template: ComponentStory<typeof SpeechConfirmDialogWrapper> = (args) => <SpeechConfirmDialogWrapper {...args} />;

export const SpeechConfirmDialog1 = Template.bind({});
SpeechConfirmDialog1.args= {open: true};
