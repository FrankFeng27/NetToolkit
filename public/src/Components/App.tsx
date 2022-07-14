import * as React from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { setOpenLoginDialog } from "../actions";
import { UtilitiesLayout } from "./Layouts";
import theme from "./theme/apptheme";
import CurrentContext, { GlobalContext } from "./CurrentContext";
import { LogInTypeEnum } from "../dataprovider/data-types";
import { DataAccessor } from "../dataprovider/dataprovider";


export const Application: React.FC = () => {
  let [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);
  const dispatch = useDispatch();
  const context: GlobalContext = React.useMemo<GlobalContext>(() => ({
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

  return (
    <CurrentContext.Provider value={context}>
    <ThemeProvider theme={theme}>
        <Box sx={{width: "100%", height: "100%"}}>
            <UtilitiesLayout></UtilitiesLayout>
        </Box>
    </ThemeProvider>
    </CurrentContext.Provider>
  );
};
