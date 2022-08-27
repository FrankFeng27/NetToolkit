
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

interface NTKSpeechTextAreaProps {
  text?: string;
  onTextChanged?: (text: string)=>void;
}

export const NTKSpeechTextarea: React.FC<NTKSpeechTextAreaProps> = (props: NTKSpeechTextAreaProps) => {
  const text = props.text ? props.text.slice() : "";
  function onTextChanged(e: React.ChangeEvent<HTMLTextAreaElement>) {
    if (!e.target || !e.target.value) {
      return;
    }
    if (props.onTextChanged) {
      props.onTextChanged(e.target.value as string);
    }
    /// getGlobalData().currentSpeechText = e.target.value;
  }
  console.log(`text is ${text}`);
  return (
    <TextAreaContainer>
    {
      text.length >= 0 ?
      (<TextArea onChange={onTextChanged} value={text}></TextArea>)
      : (<TextArea onChange={onTextChanged} placeholder="type here..."></TextArea>)
    }
    </TextAreaContainer>
  );
};
