import * as React from "react";
import styled from "styled-components";
import * as sha256 from 'crypto-js/sha256';
import * as Base64 from "crypto-js/enc-base64";
import { ChangeSpeechRangeCb, NTKSpeechTextarea } from "./SpeechTextArea";
import { NTKSpeechToolbar } from "./SpeechToolbar";
import { TextRange, splitTextToSentence, SpeechRange } from "./SpeechUtils";

const NTKSpeechWorkAreaContainer = styled.div`
  flex-grow: 10;
  display: flex;
  flex-direction: column;
  padding: 20px 10px 40px 10px;
`;

export interface NTKSpeechWorkAreaProps {
  text: string;
  onTextChanged: (text: string) => void;
}

export const NTKSpeechWorkArea: React.FC<NTKSpeechWorkAreaProps> = (props: NTKSpeechWorkAreaProps) => {
  const k = props.text && props.text.length > 0 ? Base64.stringify(sha256(props.text)) : "empty-text";
  let changeSpeechRangeCb: ChangeSpeechRangeCb | undefined;
  const changeSpeechRange = (r: SpeechRange) => {
    if (changeSpeechRangeCb) {
      changeSpeechRangeCb(r);
    }
  }
  const setChangeRangeCb = (cb: ChangeSpeechRangeCb) => (changeSpeechRangeCb = cb);
  return (
    <NTKSpeechWorkAreaContainer>
      <NTKSpeechToolbar key={"toolbar://"+props.text} text={props.text} setRange={changeSpeechRange}></NTKSpeechToolbar>
      <NTKSpeechTextarea key={"textarea://"+k} onTextChanged={props.onTextChanged} text={props.text} setChangeRangeCb={setChangeRangeCb}></NTKSpeechTextarea>
    </NTKSpeechWorkAreaContainer>
  )
};