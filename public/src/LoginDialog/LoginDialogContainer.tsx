import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { LogInTypeEnum, RootState } from "../dataprovider/data-types";
import { DataAccessor } from "../dataprovider/dataprovider";
import LoginDialog, { ISigInUpData } from "./LoginDialog";
import { openLoginDialog } from "./LoginSlice";

interface NTKLoginDialogWrapperProps {
  setIsLoggedIn: (v: boolean) => void;
}

const NTKLoginDialogWrapper: React.FC<NTKLoginDialogWrapperProps> = (props: NTKLoginDialogWrapperProps) => {
  const { loginDlgType } = useSelector((state: RootState) => (state.login));
  const dispatch = useDispatch();
 
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
  function closeDialog() {
    dispatch(openLoginDialog(LogInTypeEnum.Hide));
  }
  return (
    <LoginDialog 
     openType={loginDlgType}
     onSubmitSignIn={submitSignInData}
     onSubmitSignUp={submitSignUpData}
     onCloseDialog={closeDialog}
    ></LoginDialog>
  );
};

export default NTKLoginDialogWrapper;