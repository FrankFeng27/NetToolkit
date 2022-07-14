import * as React from "react";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import * as PropTypes from "prop-types";

import WatermarkCanvasContainer from "../../Container/watermarkcanvascontainer";

const element_style = {
  root: { margin: "0 auto" },
  canvas: {
    minWidth: 400,
    minHeight: 300
  },
  options: {
    margin: "20 auto",
    paddingBottom: 100
  },
  label: {
    minWidth: 75,
    display: "inline-block"
  }
};

export interface WatermarkPanelProps {
  onTextChanged(text: string): void;
  onFontsizeChanged(fontsize: string): void;
  onOffsetXChanged(x: string): void;
  onOffsetYChanged(y: string): void;
  onRotateChanged(angle: string): void;
  // optional
  text?: string;
  offsetX?: string;
  offsetY?: string;
  fontsize?: string;
  angle?: string;
}

class WatermarkPanel extends React.Component<WatermarkPanelProps> {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e: any) {
    if (!e || !e.target || !e.target.id) {
      return;
    }
    switch (e.target.id) {
      case "water-mark-text":
        this.props.onTextChanged(e.target.value);
        break;
      case "water-mark-fontsize":
        this.props.onFontsizeChanged(e.target.value);
        break;
      case "water-mark-offsetx":
        this.props.onOffsetXChanged(e.target.value);
        break;
      case "water-mark-offsety":
        this.props.onOffsetYChanged(e.target.value);
        break;
      case "water-mark-rotate":
        this.props.onRotateChanged(e.target.value);
        break;
      default:
        break;
    }
  }

  // <canvas id="water-mark-canvas" style={element_style.canvas} />
  render() {
    const current_state = this.props;
    return (
      <div id="water-mark-div" style={element_style.root}>
        <WatermarkCanvasContainer></WatermarkCanvasContainer>
        <Typography component="div" style={element_style.options}>
          <Box m={1}>
            <span style={element_style.label}>text: </span>
            <input
              id="water-mark-text"
              type="text"
              value={current_state.text}
              onChange={this.handleChange}
            />
          </Box>
          <Box m={1}>
            <span style={element_style.label}>font size: </span>
            <input
              id="water-mark-fontsize"
              type="text"
              value={current_state.fontsize}
              onChange={this.handleChange}
            />
          </Box>
          <Box m={1}>
            <span style={element_style.label}>offset x: </span>
            <input
              id="water-mark-offsetx"
              type="text"
              value={current_state.offsetX}
              onChange={this.handleChange}
            />
          </Box>
          <Box m={1}>
            <span style={element_style.label}>offset y: </span>
            <input
              id="water-mark-offsety"
              type="text"
              value={current_state.offsetY}
              onChange={this.handleChange}
            />
          </Box>
          <Box m={1}>
            <span style={element_style.label}>rotate: </span>
            <input
              id="water-mark-rotate"
              type="text"
              value={current_state.angle}
              onChange={this.handleChange}
            />
          </Box>
        </Typography>
      </div>
    );
  }
}

export default WatermarkPanel;
