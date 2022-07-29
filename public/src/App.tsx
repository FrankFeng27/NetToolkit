import * as React from "react";
import { useDispatch } from "react-redux";
import { setOpenLoginDialog } from "./actions";
import CurrentContext, { GlobalContext } from "./CurrentContext";
import { LogInTypeEnum } from "./dataprovider/data-types";
import { DataAccessor } from "./dataprovider/dataprovider";

export const Application: React.FC = () => {
  let [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);
  const dispatch = useDispatch();
  const context: GlobalContext = React.useMemo(() => ({
    isLoggedIn: isLoggedIn,
    setIsLoggedIn,
    onOpenSignInDlg: () => dispatch(setOpenLoginDialog(LogInTypeEnum.SignIn)),
    onOpenSignUpDlg: () => dispatch(setOpenLoginDialog(LogInTypeEnum.SignUp))
  }), [isLoggedIn]);

  React.useEffect(() => {
    const fetchData = async () => {
      const isLoggedIn = await DataAccessor.isLoggedIn();
      setIsLoggedIn(isLoggedIn !== undefined ? isLoggedIn : false);
    };
    fetchData();
  }, []);

  return (<CurrentContext.Provider value={context}>
    <div>Test Demo</div>
  </CurrentContext.Provider>)
};
