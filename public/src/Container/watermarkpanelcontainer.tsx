
import {connect} from "react-redux";
import WatermarkPanel from "../Components/Widgets/WaterMarkPanel";
import {setImgToolText, setImgToolFontsize, setImgToolOffsetX, setImgToolOffsetY, setImgToolRotate} from "../actions";
import utils from '../utils/utils';

const is_integer_or_empty = (n : any) : boolean => {
    if (utils.isInteger(n)) {
        return true;
    }
    return utils.isString(n) && n.length === 0;
};

interface ImageWatermarkState {
  text?: string;
  fontSize?: number;
  offsetX?: number;
  offsetY?: number;
  angle?: number;
}

const mapStateToProps = (state = {imgWatermarkTool: {}}) => {
    if (!state.imgWatermarkTool) {
        state.imgWatermarkTool = {};
    }
    const state_img_tools = state.imgWatermarkTool;
    const img_tools = {...state_img_tools,
        text: state_img_tools.text ? state_img_tools.text : "",
        fontsize: typeof state_img_tools.fontsize === 'string' ? state_img_tools.fontsize : "12",
        offsetX: typeof state_img_tools.offsetX === 'string' ? state_img_tools.offsetX : "0",
        offsetY: typeof state_img_tools.offsetY === 'string' ? state_img_tools.offsetY : "0",
        angle: typeof state_img_tools.angle  === 'string' ? state_img_tools.angle : "0"
    };
    return (img_tools);
};
const mapDispatchToProps = dispatch => ({
    onTextChanged: text => dispatch(setImgToolText(text)),
    onFontsizeChanged: font_size => dispatch(setImgToolFontsize(font_size)),
    onOffsetXChanged: offset_x => dispatch(setImgToolOffsetX(offset_x)),
    onOffsetYChanged: offset_y => dispatch(setImgToolOffsetY(offset_y)),
    onRotateChanged: angle => dispatch(setImgToolRotate(angle))
});

export default connect( mapStateToProps, mapDispatchToProps )(WatermarkPanel);
