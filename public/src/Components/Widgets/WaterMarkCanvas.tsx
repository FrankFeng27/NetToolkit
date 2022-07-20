import * as React from "react";
import { styled as muiStyled } from "@material-ui/core/styles";
import { Button, Container, Divider } from "@material-ui/core";
import styled from "styled-components";
import utils from "../../utils/utils";

// As Image will be overloaded by image-js, save Image as BuitinImage
const BuiltinImage = Image;

import Image from "image-js";

const RootContainer = styled.div`
  font-size: 12px;
`;

const StyledDivider = muiStyled(Divider)(({ theme }) => ({
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1)
}));

const get_fontsize = (fontsize: string | number): number => {
  console.assert(fontsize !== undefined, "invalid fontsize.");
  var n = utils.toInteger(fontsize);
  return n === 0 ? 12 : n;
};

const get_coordinate = (coord: string | number): number => {
  if (coord === undefined) {
    return 0;
  }
  return utils.toInteger(coord);
};

const reduce_style_min = (elem: HTMLElement, width: number, height: number) => {
  let min_width = parseInt(elem.style.minWidth); // convert '100px' to 100
  let min_height = parseInt(elem.style.minHeight);
  if (min_width > width) {
    elem.style.minWidth = String(width) + "px";
  }
  if (min_height > height) {
    elem.style.minHeight = String(height) + "px";
  }
};

export interface WatermarkCanvasProps {
  // required
  onFileUploaded(fobj: object, result: any, w: number, h: number): void;
  onSetCanvasWidth(w: number): void;
  onSetCanvasHeight(h: number): void;
  // optional
  fileContent?: string;
  fileName?: string;
  width?: string;
  imgWidth?: number;
  height?: string;
  imgHeight?: number;
  fontsize?: string;
  offsetX?: string;
  offsetY?: string;
  angle?: string;
  text?: string;
}

const WatermarkCanvas: React.FC<WatermarkCanvasProps> = (
  props: WatermarkCanvasProps
) => {
  function readFile(fobj: File): void {
    let reader = new FileReader();
    reader.onload = function(event) {
      if (event.target.readyState === FileReader.DONE) {
        let result = event.target.result;
        var file_name_label = document.getElementById("watermark-file-name");
        if (file_name_label && fobj.name) {
          file_name_label.innerHTML = "";
          var tn = document.createTextNode(fobj.name);
          file_name_label.appendChild(tn);
        }
        Image.load(result).then(img => {
          props.onFileUploaded(fobj, result, img.width, img.height);
        });
      }
    };
    let blob = fobj.slice(0, fobj.size);
    reader.readAsDataURL(blob);
  }
  function handleChange(e: any) {
    if (!e || !e.target || !e.target.id) {
      return;
    }
    switch (e.target.id) {
      case "outlined-button-file":
        {
          if (!e.target.files) {
            return;
          }
          let files = e.target.files;
          if (files.length === 0) {
            return;
          }
          readFile(files[0]);
        }
        break;
      case "watermark-width":
        props.onSetCanvasWidth(e.target.value);
        break;
      case "watermark-height":
        props.onSetCanvasHeight(e.target.value);
        break;
      default:
        break;
    }
  }
  function downloadImage(): void {
    const link = document.createElement("a");
    link.download = "watermark-image.png";
    link.href = (document.getElementById(
      "watermark-canvas"
    ) as HTMLCanvasElement).toDataURL();
    link.click();
  }
  function draw_watermark(ctx: CanvasRenderingContext2D): void {
    if (!props.text) {
      return;
    }
    var font = get_fontsize(props.fontsize).toString() + "px Arial";
    ctx.font = font;
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    var x = get_coordinate(props.offsetX);
    var y = get_coordinate(props.offsetY);
    var angle = get_coordinate(props.angle);
    ctx.save();
    ctx.translate(x, y);
    angle = (angle * Math.PI) / 180.0;
    ctx.rotate(angle);
    ctx.fillText(props.text, 0, 0);
    ctx.restore();
  }
  function load_image(canvas: HTMLCanvasElement): void {
    var img = document.createElement("img");
    let canvas_width = utils.toInteger(props.width);
    let canvas_height = utils.toInteger(props.height);
    img.src = props.fileContent;
    img.onload = () => {
      var ctx = canvas.getContext("2d");
      canvas.width = canvas_width;
      canvas.height = canvas_height;
      reduce_style_min(canvas, canvas_width, canvas_height);
      ctx.drawImage(img, 0, 0, canvas_width, canvas_height);
      draw_watermark(ctx);
    };
  }
  function update_canvase(): void {
    if (!props.fileName || !props.fileContent) {
      return;
    }
    var canvas = document.getElementById(
      "watermark-canvas"
    ) as HTMLCanvasElement;
    if (!canvas) {
      return;
    }
    load_image(canvas);
  }
  React.useEffect(() => {
    update_canvase();
  });

  let width = "";
  let height = "";
  if (props.width && props.height) {
    width = String(props.width);
    height = String(props.height);
  } else if (props.imgWidth && props.imgHeight) {
    width = String(props.imgWidth);
    height = String(props.imgHeight);
  }
  return (
    <RootContainer id="watermark-canvas-container">
      <form>
        <Container fixed>
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="outlined-button-file"
            type="file"
            onChange={handleChange}
          />
          <label htmlFor="outlined-button-file">
            <Button variant="outlined" component="span">
              Upload file
            </Button>
          </label>
          <label style={{ margin: "auto 10px" }}>
            <span id="watermark-file-name">image file</span>
          </label>
          <input
            type="text"
            id="watermark-width"
            defaultValue={width}
            style={{ width: "100px", height: "25px", margin: "auto 10px" }}
            onChange={handleChange}
          />
          <label>
            <span style={{ fontSize: "16px" }}>*</span>
          </label>
          <input
            type="text"
            id="watermark-height"
            defaultValue={height}
            style={{ width: "100px", height: "25px", margin: "auto 10px" }}
            onChange={handleChange}
          />
          <Button variant="outlined" component="span" onClick={downloadImage}>
            Download as image
          </Button>
        </Container>
      </form>
      <StyledDivider />
      <canvas id="watermark-canvas" style={{ minWidth: 200, minHeight: 150 }} />
    </RootContainer>
  );
};

export default WatermarkCanvas;
