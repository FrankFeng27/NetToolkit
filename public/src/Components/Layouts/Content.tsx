import * as React from "react";
import { Paper, Tabs } from "@material-ui/core";
import Tab from "@material-ui/core/Tab";

export default props => (
  <Paper>
    <Tabs value={0} indicatorColor="primary" textColor="primary">
      <Tab label="Image Tools" />
      <Tab label="Storage" />
      <Tab label="Others" />
    </Tabs>
  </Paper>
);
