
import * as React from "react";
import styled from "styled-components";
/// import { getGlobalData } from "../dataprovider/global-data";

const TextAreaContainer = styled.div`
  flex-grow: 10;
  margin: 20px 10px;
  background-color: white;
  display: flex;
  flex-direction: column;
  padding: 10px 0;
`;

const TextArea = styled.textarea`
  flex-grow: 10;
`;

interface SpeechTextAreaProps {
  text?: string;
  onTextChanged?: (text: string)=>void;
}

export const SpeechTextarea: React.FC<SpeechTextAreaProps> = (props: SpeechTextAreaProps) => {
  function onTextChanged(e: React.ChangeEvent<HTMLTextAreaElement>) {
    if (!e.target || !e.target.value) {
      return;
    }
    if (props.onTextChanged) {
      props.onTextChanged(e.target.value as string);
    }
    /// getGlobalData().currentSpeechText = e.target.value;
  }
  return (
    <TextAreaContainer>
      <TextArea onChange={onTextChanged} placeholder="Type here ..."></TextArea>
    </TextAreaContainer>
  );
};
