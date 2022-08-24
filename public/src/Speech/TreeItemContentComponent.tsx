import { TreeItemContentProps, useTreeItem } from "@mui/lab";
import { Input, Typography } from "@mui/material";
import clsx from "clsx";
import * as React from "react";

export interface TreeItemContentComponentProps extends TreeItemContentProps {
  labelText: string;
  onLabelChanged: (value: string) => void;
  id: string;
  currentId: string;
}

type ContentMode = "display" | "edit";

export const TreeItemContentComponent = React.forwardRef((props: TreeItemContentComponentProps, ref) => {
  const {
    classes,
    className,
    label,
    nodeId,
    icon: iconProp,
    expansionIcon,
    displayIcon,
  } = props;

  const {
    disabled,
    expanded,
    selected,
    focused,
    handleExpansion,
    handleSelection,
    preventSelection,
  } = useTreeItem(nodeId);
  const icon = iconProp || expansionIcon || displayIcon;

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    preventSelection(event);
  };

  const handleExpansionClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    handleExpansion(event);
  };
  
  const [mode, setMode] = React.useState<ContentMode>("display");
  const [text, setText] = React.useState<string>(props.labelText);
  const inputRef = React.useRef(null);
  function onDoubleClick(event) {
    if (props.id !== props.currentId) {
      handleSelection(event);
    }
    if (mode === "display") {
      setMode("edit");
    }
  }
  function onClick(event) {
    if (props.id === props.currentId) {
      setMode("edit");
    } else {
      handleSelection(event);
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
    v !== undefined ? setText(v) : setText("");
  }
  function onInputBlur(event) {
    const v = event.target.value as string;
    if (v === undefined || v.length === 0) {
      setText(props.labelText);
    } else {
      props.onLabelChanged(v);
    }
    setMode("display");
  }
  return (
    <div
      className={clsx(className, classes.root, {
        [classes.expanded]: expanded,
        [classes.selected]: selected,
        [classes.focused]: focused,
        [classes.disabled]: disabled,
      })}
      onMouseDown={handleMouseDown}
      ref={ref as React.Ref<HTMLDivElement>}
    >
      <div onClick={handleExpansionClick} className={classes.iconContainer}>
        {icon}
      </div>
      {mode === "display" ? (
        <Typography
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        component="div"
        className={classes.label}
      >
        {props.labelText}
      </Typography>
      ): (
        <Input value={text} onChange={onChange} onKeyDown={onKeyPressed} onBlur={onInputBlur} autoFocus />
      )}
    </div>
  );
  /*
  return (
    <Container ref={ref as React.Ref<HTMLDivElement>}>
      {mode === "display" ? (
        <label onDoubleClick={onDoubleClick} onClick={onClick}>{text}</label>
      ) : (
        <input value={text} onChange={onChange} onKeyDown={onKeyPressed} onBlur={onInputBlur} autoFocus></input>
      )}
    </Container>
  );
  */
});
