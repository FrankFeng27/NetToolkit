import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOpenLoginDialog } from "../actions";
import CurrentContext from "../CurrentContext";
import { LogInTypeEnum, RootState } from "../dataprovider/data-types";
import { DataAccessor } from "../dataprovider/dataprovider";
import LoginDialog, { ISigInUpData } from "./LoginDialog";

import {LoginState } from "./LoginSlice";

interface OwnProps {
  setIsLoggedIn: (v: boolean) => void;
}

const mapStateToProps = (state: LoginState) => ({
  openType: state.loginDlgType
});

const mapDispatchToProps = (dispatch) => ({
  onClose: () => dispatch(setOpenLoginDialog(LogInTypeEnum.Hide)),
});

interface NTKLoginDialogWrapperProps {
  setIsLoggedIn: (v: boolean) => void;
}

const NTKLoginDialogWrapper: React.FC<NTKLoginDialogWrapperProps> = (props: NTKLoginDialogWrapperProps) => {
  const { loginDlgType } = useSelector((state: RootState) => (state.login));
 
  async function submitSignInData(data: ISigInUpData): Promise<boolean> {
    try {
      const res = await DataAccessor.signIn(data.name, data.password);
      if (res) {
        const isLoggedIn = await DataAccessor.isLoggedIn();
        props.setIsLoggedIn(isLoggedIn !== undefined ? isLoggedIn : false);
        return true;
      } else {
        alert("Oops! Failed to sign in.");
        return false;
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  }
  async function submitSignUpData(data: ISigInUpData): Promise<boolean> {
    try {
        const res = await DataAccessor.signUp(data.name, data.email, data.password);
        if (!res) {
          alert("Oops! Failed to sign up.");
          return false;
        } 
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
  }
  return (
    <LoginDialog 
     openType={loginDlgType}
     onSubmitSignIn={submitSignInData}
     onSubmitSignUp={submitSignUpData}
    ></LoginDialog>
  );
};

export default NTKLoginDialogWrapper;