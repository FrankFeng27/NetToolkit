
import {connect} from "react-redux";
import {setImgToolImgFile, setImgToolWidth, setImgToolHeight} from "../actions";
import WaterMarkCanvas from "../Components/Widgets/WaterMarkCanvas";

const mapStateToProps = (state = {imgWatermarkTool: {}}) => {
    if (!state.imgWatermarkTool) {
        state.imgWatermarkTool = {};
    }
    return state.imgWatermarkTool;
}

const mapDispatchToProps = dispatch => ({
    onFileUploaded: (file_name: string, file_content: string, w: number, h: number) => dispatch(setImgToolImgFile(file_name, file_content, w, h)),
    onSetCanvasWidth: (w) => dispatch(setImgToolWidth(w)),
    onSetCanvasHeight: (h) => dispatch(setImgToolHeight(h))
});

export default connect(mapStateToProps, mapDispatchToProps)(WaterMarkCanvas);

