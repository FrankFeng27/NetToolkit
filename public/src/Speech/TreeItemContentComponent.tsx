import { TreeItemContentProps } from "@mui/lab";
import * as React from "react";
import styled from "styled-components";

const Container = styled.div`
`;

export interface TreeItemContentComponentProps extends TreeItemContentProps {
  labelText: string;
  onLabelChanged: (value: string) => void;
  id: string;
  currentId: string;
}

type ContentMode = "display" | "edit";

export const TreeItemContentComponent = React.forwardRef((props: TreeItemContentComponentProps, ref) => {
  const [mode, setMode] = React.useState<ContentMode>("display");
  const [text, setText] = React.useState<string>(props.labelText);
  const inputRef = React.useRef(null);
  function onDoubleClick() {
    if (mode === "display") {
      setMode("edit");
    }
  }
  function onClick(event) {
    if (props.id === props.currentId) {
      setMode("edit");
    }
  }
  function onKeyPressed(event) {
    if (event.key === 'Enter') {
      if (mode === "edit") {
        // fixme: get value from input
        props.onLabelChanged(event.target.value);
        setMode("display");
      }
    }
  }
  function onChange(event) {
    const v = event.target.value;
    if (v) {
      setText(v);
    }
  }
  function onInputBlur(event) {
    const v = event.target.value;
    props.onLabelChanged(v);
    setMode("display");
  }
  return (
    <Container ref={ref as React.Ref<HTMLDivElement>}>
      {mode === "display" ? (
        <label onDoubleClick={onDoubleClick} onClick={onClick}>{text}</label>
      ) : (
        <input value={text} onChange={onChange} onKeyDown={onKeyPressed} onBlur={onInputBlur} autoFocus></input>
      )}
    </Container>
  );
});
