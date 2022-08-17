import * as React from "react";
import styled from "styled-components";

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
export enum SpeechPlayState {
  kUnknown = 0,
  kPlaying = 1,
  kPaused = 2,
  kStopped = 3,
}
export interface NTKSpeechToolbarProps {
  onPlay?: () => void;
  onStop?: () => void;
  onResume?: () => void;
  onPause?: () => void;
  text?: string;
}
export const NTKSpeechToolbar: React.FC<NTKSpeechToolbarProps> = (props: NTKSpeechToolbarProps) => {
  const synth = window.speechSynthesis;
  const [playState, setPlayState] = React.useState<SpeechPlayState>(SpeechPlayState.kUnknown);

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
      const utter = new SpeechSynthesisUtterance(props.text);
      synth.speak(utter);
      utter.onend = () => (setPlayState(SpeechPlayState.kStopped));
      utter.onpause = () => (setPlayState(SpeechPlayState.kPaused));
    }
    setPlayState(SpeechPlayState.kPlaying);
  }
  function onPause() {
    if (playState === SpeechPlayState.kPlaying) {
      synth.pause();
    }
  }
  return (
    <SpeechToolbarContainer>
      <SpeechToolItem><SpeechToolButton>Backward</SpeechToolButton></SpeechToolItem>
      {playState === SpeechPlayState.kPlaying ?
       (<SpeechToolItem><SpeechToolButton onClick={onStop}>Stop</SpeechToolButton></SpeechToolItem>) : 
       (<SpeechToolItem><SpeechToolButton disabled>Stop</SpeechToolButton></SpeechToolItem>)}
      {playState === SpeechPlayState.kPlaying ? 
       <SpeechToolItem><SpeechToolButton onClick={onPause}>Pause</SpeechToolButton></SpeechToolItem>
       : <SpeechToolItem><SpeechToolButton onClick={onPlay}>Play</SpeechToolButton></SpeechToolItem>}
      <SpeechToolItem><SpeechToolButton>Forward</SpeechToolButton></SpeechToolItem>
    </SpeechToolbarContainer>
  )
};