
import { connect } from "react-redux";
import { setLoggedIn, setLoggedOut, setLoggedUp, setOpenLoginDialog } from "../actions";
import Headerbar from "../Components/Layouts/Header";
import { LogInTypeEnum } from "../dataprovider/data-types";

interface OwnProps {
  isLoggedIn: boolean;
  onOpenSignInDlg: () => void;
  onOpenSignUpDlg: () => void;
  setIsLoggedIn: (v: boolean) => void;
}

interface StateProps {
  open: LogInTypeEnum;
}

interface DispatchProps {
  onLoggedUp: () => void;
  onCancelSignInUpDlg: () => void;
}

const mapStateToProps = (state = {loginTool: {open: LogInTypeEnum.Hide}}) => {
  state.loginTool = state.loginTool ?? {open: LogInTypeEnum.Hide};
  const login: StateProps = { open: state.loginTool.open ?? LogInTypeEnum.Hide };

  return login;
};

const mapDispatchToProps = dispatch => ({
  onLoggedUp: () => dispatch(setLoggedUp()),
  onCancelSignInUpDlg: () => dispatch(setOpenLoginDialog(LogInTypeEnum.Hide))
});

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(Headerbar);
