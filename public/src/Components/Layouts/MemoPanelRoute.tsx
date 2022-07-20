import * as React from "react";

/// import WatermarkContainer from "../../Container/watermarkpanelcontainer";
import { PanelRouteProps } from "../../dataprovider/data-types";
import MemoPanelContainer from "../../Container/MemoPanelContainer";
import CurrentContext from "../CurrentContext";
import { StyledPanel } from "./PanelContainer";


const MemoPanelRoute: React.FC<PanelRouteProps> = (props: PanelRouteProps) => {
  const context = React.useContext(CurrentContext);
  return (
  <StyledPanel open={props.openDrawer}>
    <MemoPanelContainer 
    isLoggedIn={context.isLoggedIn}
    onOpenSignInDlg={context.onOpenSignInDlg}
    onOpenSignUpDlg={context.onOpenSignUpDlg}
    />
  </StyledPanel>
  );
}

export default MemoPanelRoute;
