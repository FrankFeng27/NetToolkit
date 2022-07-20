
import {combineReducers} from "redux";
import { LogInTypeEnum } from "../dataprovider/data-types";
import utils from "../utils/utils"
import speechReducer from "../Speech/SpeechSlice";


const imgWatermarkTool = (state : any, action) => {
    state = state || {};
    switch (action.type) {
        case "WATERMARK_SET_TEXT":
            return {...state, text: action.text};
        case "WATERMARK_SET_FONTSIZE":
            return {...state, fontsize: action.fontsize};
        case "WATERMARK_SET_OFFSETX":
            return {...state, offsetX: action.offsetX};
        case "WATERMARK_SET_OFFSETY":
            return {...state, offsetY: action.offsetY};
        case "WATERMARK_SET_ROTATE":
            return {...state, angle: action.angle};
        case "WATERMARK_SET_IMGFILE":         
            // reset width and height to imgWidth and imgHeight   
            return {...state, 
                fileName: action.fileName, 
                fileContent: action.fileContent, 
                imgWidth: action.width, 
                imgHeight: action.height,
                width: String(action.width),
                height: String(action.height)
            };
        case "WATERMARK_SET_WIDTH":
            var imgWidth = utils.toInteger(state.imgWidth);
            var imgHeight = utils.toInteger(state.imgHeight);
            if (imgWidth > 0 && imgHeight > 0) {
                let ratio = imgHeight / imgWidth;
                let width = utils.toInteger(action.width);
                if (width > 0) {
                    let height = Math.floor(width * ratio);
                    return {...state, width: action.width, height: String(height)};
                }
            }
            // Otherwise, don't change height
            return {...state, width: action.width};
        case "WATERMARK_SET_HEIGHT":
            var imgWidth = utils.toInteger(state.imgWidth);
            var imgHeight = utils.toInteger(state.imgHeight);
            if (imgWidth > 0 && imgHeight > 0) {
                let ratio = imgWidth / imgHeight;
                let height = utils.toInteger(action.height);
                if (height > 0) {
                    let width = Math.floor(height * ratio);
                    return {...state, width: String(width), height: action.height};
                }
            }
            // Otherwise, we won't change width
            return {...state, height: action.height};
        default:
            return state;
    }
};

const memoTool = (state: any, action) => {
    state = state || {};
    switch (action.type) {
        default: 
            return state;
    }
};

const loginTool = (state: any, action: {type: string, open: LogInTypeEnum}) => {
    state = state || {};
    switch (action.type) {
        case "LOGIN_OPENDIALOG": {
            return {...state, open: action.open};
        }
        default: 
            return state;
    }
};
const speechTool = (state: any, action: {type: string, load: any}) => {
  state = state??{};
  switch (action.type) {
    case "SPEECH_SET_TEXT": {
      return {text: action.load as string};
    }
    default:
      return state;
  }
};

export default combineReducers({
    imgWatermarkTool, 
    memoTool, 
    loginTool,
    speechTool,
    speeches: speechReducer
});