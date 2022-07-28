import * as React from "react";
import styled from "styled-components";

const Container = styled.div`
`;

export interface TreeItemContentComponentProps {
  label: string;
  onLabelChanged: (value: string) => void;
  id: string;
  currentId: string;
}

type ContentMode = "display" | "edit";

export const TreeItemContentComponent: React.FC<TreeItemContentComponentProps> = (props: TreeItemContentComponentProps) => {
  const [mode, setMode] = React.useState<ContentMode>("display");
  function onDoubleClick() {
    if (mode === "display") {
      setMode("edit");
    }
  }
  function onClick() {
    if (props.id === props.currentId) {
      setMode("edit");
    }
  }
  function onKeyPressed(event) {
    if (event.key === 'Enter') {
      if (mode === "edit") {
        // fixme: get value from input
        props.onLabelChanged("");
      }
    }
  }
  return (
    <Container>
      {mode === "display" ? (
        <label onDoubleClick={onDoubleClick} onClick={onClick}>{props.label}</label>
      ) : (
        <input onKeyDown={onKeyPressed} value={props.label}></input>
      )}
    </Container>
  );
}