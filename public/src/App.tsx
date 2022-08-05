import * as React from "react";
import { useDispatch } from "react-redux";
import { Box } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { setOpenLoginDialog } from "./actions";
import CurrentContext, { GlobalContext } from "./CurrentContext";
import { LogInTypeEnum } from "./dataprovider/data-types";
import { DataAccessor } from "./dataprovider/dataprovider";
import UtilitiesDrawer from "./layout/UtilitiesDrawer";

export const Application: React.FC = () => {
  let [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);
  const dispatch = useDispatch();
  const context: GlobalContext = React.useMemo(() => ({
    isLoggedIn: isLoggedIn,
    setIsLoggedIn,
    onOpenSignInDlg: () => dispatch(setOpenLoginDialog(LogInTypeEnum.SignIn)),
    onOpenSignUpDlg: () => dispatch(setOpenLoginDialog(LogInTypeEnum.SignUp)),
    onCancelSignInUpDlg: () => dispatch(setOpenLoginDialog(LogInTypeEnum.Hide))
  }), [isLoggedIn]);
  const [openDrawer, setOpenDrawer] = React.useState(false);
  function handleUtilityClick() {
    setOpenDrawer(false);
  }
  function handleUtilitiesDrawerClose() {
    setOpenDrawer(false);
  }
  
  React.useEffect(() => {
    const fetchData = async () => {
      const isLoggedIn = await DataAccessor.isLoggedIn();
      setIsLoggedIn(isLoggedIn !== undefined ? isLoggedIn : false);
    };
    fetchData();
  }, []);

  return (<CurrentContext.Provider value={context}>
    <Box sx={{width: "100%", height: "100%"}}>
      
    </Box>
  </CurrentContext.Provider>)
};
