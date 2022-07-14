
import * as React from "react";
import { Router, Route } from "react-router-dom";
import { createBrowserHistory } from "history";
import { styled } from "@material-ui/core/styles";

import MemoPanelRoute from "./MemoPanelRoute";
import WatermarkPanelRoute from "./WatermarkPanelRoute";
/// import Headerbar from "./Header";
import HeaderbarContainer from "../../Container/HeaderContainer";
import CurrentContext from "../CurrentContext";
import UtilitiesDrawer from "./UtilitiesDrawer";
import SpeechPanelRoute from "./SpeechPanelRoute";

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

  return (
    <div style={{width: "100%", height: "100%", display: "flex", flexDirection: "column"}}>
      <StyledHeaderbarContainer>
      <HeaderbarContainer
      title="Net Toolkits"
      openDrawer={openDrawer} 
      onOpenDrawer={() => (setOpenDrawer(!openDrawer))}
      isLoggedIn={context.isLoggedIn}
      onOpenSignInDlg={context.onOpenSignInDlg}
      onOpenSignUpDlg={context.onOpenSignUpDlg}
      setIsLoggedIn={context.setIsLoggedIn}
      />
      </StyledHeaderbarContainer>
      <Router history={history}>
        <UtilitiesDrawer
        open={openDrawer}
        utilityKeys={["/", "/notebooks", "/speech", "/storage", "/others"]}
        utilityTitles={["Image Tools", "Notebooks", "Speech", "Storage", "Others"]}
        onUtilityClick={handleUtilityClicked}
        onDrawerClose={handleUtilitiesDrawerClose}
        ></UtilitiesDrawer>
        <StyledMain>
            <Route exact path="/">
              <WatermarkPanelRoute openDrawer={openDrawer}/>
            </Route>
            <Route path="/notebooks">
              <MemoPanelRoute openDrawer={openDrawer} />
            </Route>
            <Route path="/speech">
              <SpeechPanelRoute openDrawer={openDrawer} />
            </Route>
        </StyledMain>
      </Router>
    </div>
  );
}

export default UtilitiesLayout;


