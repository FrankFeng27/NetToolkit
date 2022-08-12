import { LogInTypeEnum } from "../dataprovider/data-types";

// Image tool options
export const setImgToolText = (text : string) => ({
    type: "WATERMARK_SET_TEXT",
    text: text
});

export const setImgToolFontsize = (font_size : string) => ({
    type: "WATERMARK_SET_FONTSIZE",
    fontsize: font_size
});

export const setImgToolOffsetX = (x:string) => ({
    type: "WATERMARK_SET_OFFSETX",
    offsetX: x
});

export const setImgToolOffsetY = (y:string) => ({
    type: "WATERMARK_SET_OFFSETY",
    offsetY: y
});

export const setImgToolRotate = (angle:string) => ({
    type: "WATERMARK_SET_ROTATE",
    angle: angle
});

// Image tool canvas
export const setImgToolImgFile = (file_name : string, file_content : string, w: string, h: string) => ({
    type: "WATERMARK_SET_IMGFILE",
    fileName: file_name,
    fileContent: file_content,
    width: w,
    height: h
});
export const setImgToolWidth = (width: string) => ({
    type: "WATERMARK_SET_WIDTH",
    width: width
});
export const setImgToolHeight = (height : string) => ({
    type: 'WATERMARK_SET_HEIGHT',
    height: height
});

// Login actions
export const setLoggedIn = () => ({
    type: "LOGIN_LOGGEDIN",
});
export const setLoggedOut = () => ({
    type: "LOGIN_LOGGEDOUT",
});
export const setLoggedUp = () => ({
    type: "LOGIN_LOGGEDUP",
});
export const setSpeechText = (text: string) => ({
  type: "SPEECH_SET_TEXT",
  load: text
});




