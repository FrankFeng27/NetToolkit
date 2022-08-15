import * as React from "react";
import { styled as muiStyled } from "@mui/material/styles";
import { Button, Container, Divider } from "@mui/material";
import styled from "styled-components";
import utils from "../utils/utils";

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
  fontsize?: string;
  offsetX?: string;
  offsetY?: string;
  angle?: string;
  text?: string;
}

interface ImageData {
  fileName?: string;
  fileContent?: string;
  imgWidth: number;
  imgHeight: number;
  width: number;
  height: number;
}
const initialState: ImageData = {
  imgWidth: 0,
  imgHeight: 0,
  width: 0,
  height: 0,
}

const WatermarkCanvas: React.FC<WatermarkCanvasProps> = (
  props: WatermarkCanvasProps
) => {
  const [imgData, setImgData] = React.useState<ImageData>(initialState);

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
          /// props.onFileUploaded(fobj, result, img.width, img.height);
          setImgData({
            fileName: fobj.name,
            fileContent: result.toString(),
            imgWidth: img.width,
            imgHeight: img.height,
            width: img.width,
            height: img.height,
          });
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
        {
          const imgWidth = (imgData.imgWidth);
          const imgHeight = (imgData.imgHeight);
          if (imgWidth > 0 && imgHeight > 0) {
            let ratio = imgHeight / imgWidth;
            let width = utils.toInteger(e.target.value);
            if (width > 0) {
              let height = Math.floor(width * ratio);
              setImgData({...imgData, width, height});
            }
          }
        }
        break;
      case "watermark-height":
        {
          const imgWidth = (imgData.imgWidth);
          const imgHeight = (imgData.imgHeight);
          if (imgWidth > 0 && imgHeight > 0) {
            let ratio = imgWidth / imgHeight;
            let height = utils.toInteger(e.target.value);
            if (height > 0) {
              let width = Math.floor(height * ratio);
              setImgData({...imgData, width, height});
            }
          }
        }
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
    let canvas_width = utils.toInteger(imgData.width);
    let canvas_height = utils.toInteger(imgData.height);
    img.src = imgData.fileContent;
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
    if (!imgData.fileName || !imgData.fileContent) {
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
  if (imgData.width && imgData.height) {
    width = String(imgData.width);
    height = String(imgData.height);
  } else if (imgData.imgWidth && imgData.imgHeight) {
    width = String(imgData.imgWidth);
    height = String(imgData.imgHeight);
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
