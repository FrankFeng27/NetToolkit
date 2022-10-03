import { TreeItemContentProps, useTreeItem } from "@mui/lab";
import { IconButton } from "@mui/material";
import { Input, Typography } from "@mui/material";
import { Remove } from "@mui/icons-material";
import clsx from "clsx";
import * as React from "react";
import styled from "styled-components";

const StyledLabelTypograph = styled.div`
  flex-grow: 10;
  display: flex;
  flex-direction: row;
  overflow-x: hidden;
`;

export interface TreeItemContentComponentProps extends TreeItemContentProps {
  labelText: string;
  name: string;
  onLabelChanged: (value: string) => void;
  id: string;
  currentId: string;
  onNodeRemove: (id: string) => void;
  preMouseEnter: () => void;
  preMouseLeave: () => void;
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
  const [hover, setHover] = React.useState(false);
  const inputRef = React.useRef(null);
  function onDoubleClick(event) {
    if (props.id !== props.currentId) {
      handleSelection(event);
    }
    if (mode === "display") {
      setMode("edit");
      setText(props.name);
    }
  }
  function onSelect(event) {
    if (props.id !== props.currentId) {
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
    if (event.key === 'Escape') {
      if (mode === "edit") {
        setMode("display");
      }
    }
    if (event.key === "Delete") {
      if (mode === "display") {}
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
  function handleMouseEnter() {
    props.preMouseEnter();
    setHover(true);
  }
  function handleMouseLeave() {
    props.preMouseLeave();
    setHover(false);
  }
  function onNodeRemove() {
    props.onNodeRemove(props.id);
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
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={ref as React.Ref<HTMLDivElement>}
    >
      <div onClick={handleExpansionClick} className={classes.iconContainer}>
        {icon}
      </div>
      {mode === "display" ? (!hover? ( 
        <Typography
        onClick={onSelect}
        onDoubleClick={onDoubleClick}
        component="div"
        className={classes.label}
        sx={{textOverflow: "ellipsis", fontSize: 12, overflowX: "hidden"}}
        title={props.labelText}
        >
        {props.labelText}
      </Typography>
      ): (<StyledLabelTypograph >
        <Typography
          component="div"
          className={classes.label}
          sx={{display: "flex", flexDirection: "row"}}
        >
          <Typography
            onClick={onSelect}
            onDoubleClick={onDoubleClick}
            component="div"
            sx={{textOverflow: "ellipsis", flexGrow: 10, fontSize: 12, overflowX: "hidden"}}
            title={props.labelText}
          >{props.labelText}</Typography>
          <IconButton onClick={onNodeRemove} sx={{height: 18, minWidth: 28, width: 28, fontSize: 12, paddingLeft: 0, paddingRight: 0}}>
            <Remove sx={{width: 18, height: 18}} />
          </IconButton>
        </Typography>
      </StyledLabelTypograph> ) ): (
        <Input value={text} onChange={onChange} onKeyDown={onKeyPressed} onBlur={onInputBlur} autoFocus 
        sx={{fontSize: "12px!important", padding: "0!important"}} />
      )}
    </div>
  );
});
