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

export const SpeechToolbar: React.FC = () => {
  return (
    <SpeechToolbarContainer>
      <SpeechToolItem><SpeechToolButton>Backward</SpeechToolButton></SpeechToolItem>
      <SpeechToolItem><SpeechToolButton>Play </SpeechToolButton></SpeechToolItem>
      <SpeechToolItem><SpeechToolButton>Forward</SpeechToolButton></SpeechToolItem>
    </SpeechToolbarContainer>
  )
};