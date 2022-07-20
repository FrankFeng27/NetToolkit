
import { connect } from "react-redux";
import { setOpenLoginDialog } from "../actions";
import MemoPanel, { MemoPanelProps } from "../Components/Widgets/MemoPanel";
import { LogInTypeEnum } from "../dataprovider/data-types";

interface OwnProps {
  isLoggedIn: boolean;
  onOpenSignInDlg: () => void;
  onOpenSignUpDlg: () => void;
}
interface StateProps {
  placeholder: boolean;
}
interface DispatchProps {
  placeholderDispatch: () => void;
}

const mapStateToProps = (state) => {
    if (!state.memoTool || state.memoTool.loggedIn === undefined) {
        state.memoTool = {loggedIn: false};
    }
    return (state.memoTool);
}

const mapDispatchToProps = (dispatch) => ({
    placeholderDispatch: () => ({type: "PLACEHOLDER"}),
});

export default connect<StateProps, DispatchProps, OwnProps> (mapStateToProps, mapDispatchToProps)(MemoPanel);

