import * as React from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { Dialog, DialogTitle, TextField, styled as muiStyled } from "@mui/material";

const StyledInput = styled('input')(({ theme }) => ({
  display: "block",
  boxSizeing: "border-box",
  width: "80%",
  margin: "20px",
  fontSize: 16,
}));
const StyledTextField = muiStyled(TextField)(({theme}) => ({
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(2),
}));

export interface IAddLibraryDialogData {
  name: string;
}

export interface AddSpeechLibraryDialogProps {
  open: boolean;
  onAddLibrary: (data: IAddLibraryDialogData) => void;
  onAuditLibraryName: (name: string) => boolean;
  onCloseDialog: () => void;
}

export const AddSpeechLibraryDialog: React.FC<AddSpeechLibraryDialogProps> = (props: AddSpeechLibraryDialogProps) => {
  const { register, handleSubmit } = useForm<IAddLibraryDialogData>();
  const [name, setName] = React.useState<string>("Input Name here");
    
  function onSubmitData(data: IAddLibraryDialogData) {
    props.onCloseDialog();
    props.onAddLibrary(data);
  }
  function onNameChange(e) {
    const v = e.target.value;
    if (props.onAuditLibraryName(v)) {
      setName(v);
    }
  }
  return (
    <Dialog open={props.open} onClose={props.onCloseDialog}>
      <DialogTitle>Add Library ...</DialogTitle>
      <form onSubmit={handleSubmit(onSubmitData)}>
        <StyledTextField 
         {...register("name", {pattern: /(\/[\w-_]+)+/gi})}
         required
         value={name}
         onChange={onNameChange}
        />
        <StyledInput type="submit" />
      </form>
    </Dialog>
  );
};
