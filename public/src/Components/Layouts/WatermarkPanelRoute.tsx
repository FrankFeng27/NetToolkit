
import * as React from "react";

import WatermarkContainer from "../../Container/watermarkpanelcontainer";
import { PanelRouteProps } from "../../dataprovider/data-types";
import { StyledPanel } from "./PanelContainer";

const WatermarkPanelRoute: React.FC<PanelRouteProps> = (props: PanelRouteProps) => (
  <StyledPanel open={props.openDrawer}>
    <WatermarkContainer />
  </StyledPanel>
);

export default WatermarkPanelRoute;
