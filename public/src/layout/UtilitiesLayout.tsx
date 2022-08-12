
import * as React from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import { createBrowserHistory } from "history";
import { styled } from "@mui/material/styles";

/// import MemoPanelRoute from "./MemoPanelRoute";
/// import WatermarkPanelRoute from "./WatermarkPanelRoute";
/// import Headerbar from "./Header";
/// import HeaderbarContainer from "../../Container/HeaderContainer";
import UtilitiesHeaderbar from "./UtilitiesHeader";
import CurrentContext from "../CurrentContext";
import UtilitiesDrawer from "./UtilitiesDrawer";
import WatermarkPanelRoute from "./WatermarkPanelRoute";
import SpeechPanelRoute from "./SpeechPanelRoute";
/// import SpeechPanelRoute from "./SpeechPanelRoute";

const StyledHeaderbarContainer = styled('div')`
  margin-bottom: 1rem;
`;

const StyledMain = styled('main')`
  flex-grow: 10;
  overflow-y: auto;
`;

const history = createBrowserHistory();

const UtilitiesLayout: React.FC = () => {
  const context = React.useContext(CurrentContext);
  const [openDrawer, setOpenDrawer] = React.useState(false);

  function handleUtilityClicked(key: string) {
    setOpenDrawer(false);
  }
  function handleUtilitiesDrawerClose() {
    setOpenDrawer(false);
  }
  function onLoggedUp() {
    // So far, we don't implement to dispatch the action of loggin up
  }

  return (
    <div style={{width: "100%", height: "100%", display: "flex", flexDirection: "column"}}>
      <StyledHeaderbarContainer>
      <UtilitiesHeaderbar
      title="Net Toolkits"
      openDrawer={openDrawer} 
      onOpenDrawer={() => (setOpenDrawer(!openDrawer))}
      isLoggedIn={context.isLoggedIn}
      onOpenSignInDlg={context.onOpenSignInDlg}
      onOpenSignUpDlg={context.onOpenSignUpDlg}
      setIsLoggedIn={context.setIsLoggedIn}
      />
      </StyledHeaderbarContainer>

      <BrowserRouter>
        <UtilitiesDrawer 
        open={openDrawer}
        utilityKeys={["/", "notebooks", "speeches", "/storage", "others"]}
        utilityTitles={["Image Tools", "Notebooks", "Speeches", "Storage", "Others"]}
        onUtilityClick={handleUtilityClicked}
        onDrawerClose={handleUtilitiesDrawerClose}
        />
        <Routes>
          <Route path="/" element={<WatermarkPanelRoute openDrawer={openDrawer}/>}></Route>
          <Route path="/notebooks"></Route>
          <Route path="/speeches" element={<SpeechPanelRoute openDrawer={openDrawer} />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default UtilitiesLayout;


