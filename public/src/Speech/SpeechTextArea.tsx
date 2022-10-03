
import * as React from "react";
import styled from "styled-components";
import { HighlightWithinTextarea } from "react-highlight-within-textarea";
import { SpeechRange, TextRange } from "./SpeechUtils";
/// import { getGlobalData } from "../dataprovider/global-data";

const TextAreaContainer = styled.div`
  flex-grow: 10;
  margin: 20px 10px;
  background-color: white;
  display: flex;
  flex-direction: column;
  padding: 10px 0;
  overflow: hidden;
`;

const TextArea = styled.div`
  height: 100%;
  border: 1px solid black;
  text-align: left;
  padding: 5px;
  overflow: scroll;
`;

export interface ChangeSpeechRangeCb {
  (r: SpeechRange): void;
}

export interface NTKSpeechTextAreaProps {
  text?: string;
  onTextChanged?: (text: string)=>void;
  setChangeRangeCb: (cb: ChangeSpeechRangeCb) => void;
}

export const NTKSpeechTextarea: React.FC<NTKSpeechTextAreaProps> = (props: NTKSpeechTextAreaProps) => {
  const content = props.text ? props.text.slice() : "";
  const [text, setText] = React.useState(content);
  const [speechRange, setSpeechRange] = React.useState<SpeechRange | undefined>();
  function onTextChanged(e: React.ChangeEvent<HTMLTextAreaElement>) {
    if (e === undefined || typeof e !== "string") {
      return;
    }
    if (text !== undefined && e === text) {
      return;
    }
    if (props.onTextChanged) {
      props.onTextChanged(e);
      setText(e);
    }
  }
  React.useEffect(() => {
    props.setChangeRangeCb(setSpeechRange);
  }, []);
  const range = (speechRange) ? [{
      highlight: [speechRange.sentenceRange.startIndex, speechRange.wordRange.startIndex],
      className: "yellow"
    }, {
      highlight: [speechRange.wordRange.endIndex, speechRange.sentenceRange.endIndex],
      className: "yellow"
    }, {
      highlight: [speechRange.wordRange.startIndex, speechRange.wordRange.endIndex],
      className: "red"
    }] : undefined;
  return (
    <TextAreaContainer>
      <TextArea>
        <HighlightWithinTextarea placeholder="" highlight={range} onChange={onTextChanged} value={text}></HighlightWithinTextarea>
    </TextArea>
    </TextAreaContainer>
  );
};
