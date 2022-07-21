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
  kPaused = 2
}
export interface NTKSpeechToolbarProps {
  onPlay?: () => void;
  onStop?: () => void;
  onResume?: () => void;
  onPause?: () => void;
  playState: SpeechPlayState;
}
export const NTKSpeechToolbar: React.FC<NTKSpeechToolbarProps> = (props: NTKSpeechToolbarProps) => {
  return (
    <SpeechToolbarContainer>
      <SpeechToolItem><SpeechToolButton>Backward</SpeechToolButton></SpeechToolItem>
      {props.playState === SpeechPlayState.kPlaying ? <SpeechToolItem onClick={props.onPause}>Pause</SpeechToolItem>
      : <SpeechToolItem onClick={props.onPlay}>Play</SpeechToolItem>}
      <SpeechToolItem><SpeechToolButton>Forward</SpeechToolButton></SpeechToolItem>
    </SpeechToolbarContainer>
  )
};