import * as React from "react";
import styled from "styled-components";
import { TextRange, splitTextToSentence, SpeechRange } from "./SpeechUtils";

const SpeechToolbarContainer = styled.div`
  height: 32px;
  flex-grow: 0;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
`;

const SpeechToolItem = styled.div`
  margin: 2px 5px;
`;
const SpeechToolButton = styled.button`
  width: 5rem;
`;
const SpeechVoicesSelect = styled.select``;

const convertSentencesToRanges = (arr: Array<string>): Array<TextRange> => {
  let start = 0;
  const res: Array<TextRange> = [];
  arr.forEach(v => (
    res.push({startIndex: start, endIndex: (start += v.length)})
  ));
  return res;
};

export enum SpeechPlayState {
  kPlaying = 0,
  kPaused = 1,
  kStopped = 2,
}
export interface NTKSpeechToolbarProps {
  onPlay?: () => void;
  onStop?: () => void;
  onResume?: () => void;
  onPause?: () => void;
  setRange?: (range?: SpeechRange ) => void;
  text?: string;
}
export const NTKSpeechToolbar: React.FC<NTKSpeechToolbarProps> = (props: NTKSpeechToolbarProps) => {
  const synth = window.speechSynthesis;
  const voices = synth.getVoices();
  const [playState, setPlayState] = React.useState<SpeechPlayState>(SpeechPlayState.kStopped);
  const [voice, setVoice] = React.useState<string>(voices.length > 0 ? voices[0].name : "");
  const setRangeCb = props.setRange != undefined ? props.setRange : (r?: SpeechRange) => {};

  let arrRanges: Array<TextRange> = [];
  function onStop() {
    synth.cancel();
    setPlayState(SpeechPlayState.kStopped);
  }
  function onPlay() {
    if (!props.text) {
      return;
    }
    if (synth.paused) {
      synth.resume();
    } else {
      const sentences = splitTextToSentence(props.text);
      arrRanges = convertSentencesToRanges(sentences);
      const speechVoice = voices.find(v => v.name === voice);
      const utter = new SpeechSynthesisUtterance(props.text);
      utter.voice = speechVoice;
      synth.speak(utter);
      utter.onend = () => {
        setPlayState(SpeechPlayState.kStopped);
        setRangeCb();
      };
      utter.onpause = () => (
        setPlayState(SpeechPlayState.kPaused)
      );
      utter.onmark = (e:SpeechSynthesisEvent) => {
        console.log(e);
      };
      utter.onboundary = (e: SpeechSynthesisEvent) => {
        const range = arrRanges.find((r: TextRange) => (e.charIndex >= r.startIndex && e.charIndex < r.endIndex));
        const speechRange: SpeechRange = {sentenceRange: range, wordRange: {startIndex: e.charIndex, endIndex: e.charIndex + e.charLength}};
        console.log(`range is ${range.startIndex} - ${range.endIndex}`);
        setRangeCb(speechRange);
      }
    }
    setPlayState(SpeechPlayState.kPlaying);
  }
  function onPause() {
    if (playState === SpeechPlayState.kPlaying) {
      synth.pause();
    }
  }
  function onVoiceChange(e) {
    setVoice(e.target.value);
    synth.cancel();
  }
  return (
    <SpeechToolbarContainer>
      <SpeechToolItem><SpeechToolButton disabled>Backward</SpeechToolButton></SpeechToolItem>
      {playState !== SpeechPlayState.kStopped ?
       (<SpeechToolItem><SpeechToolButton onClick={onStop}>Stop</SpeechToolButton></SpeechToolItem>) : 
       (<SpeechToolItem><SpeechToolButton disabled>Stop</SpeechToolButton></SpeechToolItem>)}
      {playState === SpeechPlayState.kPlaying ? 
       <SpeechToolItem><SpeechToolButton onClick={onPause}>Pause</SpeechToolButton></SpeechToolItem>
       : <SpeechToolItem><SpeechToolButton onClick={onPlay}>Play</SpeechToolButton></SpeechToolItem>}
      <SpeechToolItem><SpeechToolButton disabled>Forward</SpeechToolButton></SpeechToolItem>
      <SpeechToolItem>
        <SpeechVoicesSelect onChange={onVoiceChange}>
          {voices.map(v => ( voice === v.name ? <option value={v.name} selected>{v.name}</option> : <option value={v.name}>{v.name}</option> ))}
        </SpeechVoicesSelect>
      </SpeechToolItem>
    </SpeechToolbarContainer>
  )
};