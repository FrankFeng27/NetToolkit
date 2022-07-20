import * as React from "react";

/// import WatermarkContainer from "../../Container/watermarkpanelcontainer";
import { PanelRouteProps } from "../../dataprovider/data-types";
// import { SpeechPanel } from "../Widgets/SpeechPanel";
import SpeechPanelContainer from "../../Container/SpeechPanelContainer";
import CurrentContext from "../CurrentContext";
import { StyledPanel } from "./PanelContainer";


const SpeechPanelRoute: React.FC<PanelRouteProps> = (props: PanelRouteProps) => {
  const context = React.useContext(CurrentContext);
  return (
  <StyledPanel open={props.openDrawer}>
    <SpeechPanelContainer 
    isLoggedIn={context.isLoggedIn}
    onOpenSignInDlg={context.onOpenSignInDlg}
    onOpenSignUpDlg={context.onOpenSignUpDlg}
    >
    </SpeechPanelContainer>
  </StyledPanel>
  );
}

export default SpeechPanelRoute;
