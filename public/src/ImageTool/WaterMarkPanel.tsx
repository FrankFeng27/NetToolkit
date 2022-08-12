import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import WatermarkCanvas from "./WaterMarkCanvas";


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

export interface WatermarkData {
  // optional
  text?: string;
  offsetX?: string;
  offsetY?: string;
  fontsize?: string;
  angle?: string;
}

const WatermarkPanel: React.FC = () => {
  const [watermark, setWatermark] = React.useState<WatermarkData>({});

  function handleChange(e: any) {
    if (!e || !e.target || !e.target.id) {
      return;
    }
    switch (e.target.id) {
      case "water-mark-text":
        { 
          const text = (e.target.value);
          setWatermark({...watermark, text});
        }
        break;
      case "water-mark-fontsize":
        {
          const fontsize = (e.target.value);
          setWatermark({...watermark, fontsize});
        }
        break;
      case "water-mark-offsetx":
        {
          const offsetX = (e.target.value);
          setWatermark({...watermark, offsetX});
        }
        break;
      case "water-mark-offsety":
        {
          const offsetY = (e.target.value);
          setWatermark({...watermark, offsetY});
        }
        break;
      case "water-mark-rotate":
        {
          const angle = this.props.onRotateChanged(e.target.value);
          setWatermark({...watermark, angle});
        }
        break;
      default:
        break;
    }
  }

  // <canvas id="water-mark-canvas" style={element_style.canvas} />
    return (
      <div id="water-mark-div" style={element_style.root}>
        <WatermarkCanvas
         text={watermark.text}
         fontsize={watermark.fontsize}
         offsetX={watermark.offsetX}
         offsetY={watermark.offsetY}
         angle={watermark.angle} 
        />
        <Typography component="div" style={element_style.options}>
          <Box m={1}>
            <span style={element_style.label}>text: </span>
            <input
              id="water-mark-text"
              type="text"
              value={watermark.text}
              onChange={handleChange}
            />
          </Box>
          <Box m={1}>
            <span style={element_style.label}>font size: </span>
            <input
              id="water-mark-fontsize"
              type="text"
              value={watermark.fontsize}
              onChange={handleChange}
            />
          </Box>
          <Box m={1}>
            <span style={element_style.label}>offset x: </span>
            <input
              id="water-mark-offsetx"
              type="text"
              value={watermark.offsetX}
              onChange={handleChange}
            />
          </Box>
          <Box m={1}>
            <span style={element_style.label}>offset y: </span>
            <input
              id="water-mark-offsety"
              type="text"
              value={watermark.offsetY}
              onChange={handleChange}
            />
          </Box>
          <Box m={1}>
            <span style={element_style.label}>rotate: </span>
            <input
              id="water-mark-rotate"
              type="text"
              value={watermark.angle}
              onChange={handleChange}
            />
          </Box>
        </Typography>
      </div>
    );
}

export default WatermarkPanel;
