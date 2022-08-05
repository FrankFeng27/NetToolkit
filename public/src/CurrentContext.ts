import * as React from "react";

export interface GlobalContext {
  isLoggedIn: boolean;
  setIsLoggedIn: (v: boolean) => void;
  onOpenSignInDlg: () => void;
  onOpenSignUpDlg: () => void;
  onCancelSignInUpDlg: () => void;
}

let CurrentContext: React.Context<GlobalContext> = React.createContext<GlobalContext>({
  isLoggedIn: false,
  setIsLoggedIn: (_v: boolean) => {},
  onOpenSignInDlg: () => {},
  onOpenSignUpDlg: () => {},
  onCancelSignInUpDlg: () => {}
});

export default CurrentContext;