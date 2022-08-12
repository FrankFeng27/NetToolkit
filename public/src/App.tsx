import * as React from "react";
import { useDispatch } from "react-redux";
import { Box } from "@mui/material";
import { openLoginDialog } from "./LoginDialog/LoginSlice";
import CurrentContext, { GlobalContext } from "./CurrentContext";
import { LogInTypeEnum } from "./dataprovider/data-types";
import { DataAccessor } from "./dataprovider/dataprovider";
import UtilitiesLayout from "./layout/UtilitiesLayout";

export const Application: React.FC = () => {
  let [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);
  const dispatch = useDispatch();
  const context: GlobalContext = React.useMemo(() => ({
    isLoggedIn: isLoggedIn,
    setIsLoggedIn,
    onOpenSignInDlg: () => dispatch(openLoginDialog(LogInTypeEnum.SignIn)),
    onOpenSignUpDlg: () => dispatch(openLoginDialog(LogInTypeEnum.SignUp)),
  }), [isLoggedIn]);
  
  React.useEffect(() => {
    const fetchData = async () => {
      const isLoggedIn = await DataAccessor.isLoggedIn();
      setIsLoggedIn(isLoggedIn !== undefined ? isLoggedIn : false);
    };
    fetchData();
  }, []);

  return (<CurrentContext.Provider value={context}>
    <Box sx={{width: "100%", height: "100%"}}>
      <UtilitiesLayout></UtilitiesLayout>
    </Box>
  </CurrentContext.Provider>)
};
