import * as React from "react";

/// import WatermarkContainer from "../../Container/watermarkpanelcontainer";
import { PanelRouteProps } from "../dataprovider/data-types";
// import { SpeechPanel } from "../Widgets/SpeechPanel";
import NTKSpeechPanelContainer from "../Speech/SpeechPanelContainer";
import CurrentContext from "../CurrentContext";
import { StyledPanel } from "./StyledPanel";


const SpeechPanelRoute: React.FC<PanelRouteProps> = (props: PanelRouteProps) => {
  const context = React.useContext(CurrentContext);
  return (
  <StyledPanel open={props.openDrawer}>
    <NTKSpeechPanelContainer 
    isLoggedIn={context.isLoggedIn}
    onOpenSignInDlg={context.onOpenSignInDlg}
    onOpenSignUpDlg={context.onOpenSignUpDlg}
    />
  </StyledPanel>
  );
}

export default SpeechPanelRoute;
