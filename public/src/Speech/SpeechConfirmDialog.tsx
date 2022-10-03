import * as React from "react";
import styled from "styled-components";
import { Dialog, DialogTitle, Typography, Button } from "@mui/material";

const BodyContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px 25px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row-reverse;
  margin: 20px 5px 10px 5px;
`;

export interface ISpeechConfirmDialogProps {
  open: boolean;
  title: string;
  text: string;
  userData?: any;
  onOKCallback: (userData: any) => void;
  onCancelCallback: () => void;
}

export const SpeechConfirmDialog: React.FC<ISpeechConfirmDialogProps> = (props: ISpeechConfirmDialogProps) => {
  function onOK() {
    props.onOKCallback(props.userData);
  }
  function onCancel() {
    props.onCancelCallback();
  }
  return (
    <Dialog open={props.open} onClose={props.onCancelCallback}>
        <DialogTitle>{props.title}</DialogTitle>
        <BodyContainer>
            <Typography>{props.text}</Typography>
            <ButtonContainer>
                <Button variant="outlined" sx={{fontSize: 16, padding: "2px 16px", minWidth: 100}} onClick={onCancel}>Cancel</Button>
                <span style={{width: 5}}></span>
                <Button variant="contained" sx={{fontSize: 16, padding: "2px 16px", minWidth: 100}} onClick={onOK}>OK</Button>
            </ButtonContainer>
        </BodyContainer>
    </Dialog>
  );
};


