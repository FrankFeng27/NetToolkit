
import * as React from "react";

import { PanelRouteProps } from "../dataprovider/data-types";
import WatermarkPanel from "../ImageTool/WaterMarkPanel";
import { StyledPanel } from "./StyledPanel";


const WatermarkPanelRoute: React.FC<PanelRouteProps> = (props: PanelRouteProps) => (
  <StyledPanel open={props.openDrawer}>
    <WatermarkPanel />
  </StyledPanel>
);

export default WatermarkPanelRoute;
