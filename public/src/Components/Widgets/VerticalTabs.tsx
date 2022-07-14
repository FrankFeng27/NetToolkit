import * as React from "react";
import { styled as muiStyled } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

/// import WatermarkPanel from './WaterMarkPanel';
import WatermarkContainer from "../../Container/watermarkpanelcontainer";
import { SpeechPanel } from "./SpeechPanel";

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labeledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

function allyProps(index: any) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`
  };
}

const RootContainer = muiStyled("div")(({ theme }) => ({
  flexGrow: 1,
  backgroundColor: `${theme.palette.background.paper}`,
  display: "flex",
  height: "224px"
}));

const StyledTabs = muiStyled(Tabs)(({ theme }) => ({
  borderRight: `1px solid ${theme.palette.divider}`
}));

export default function VerticalTabs() {
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <RootContainer>
      <StyledTabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertial Tabs"
      >
        <Tab label="Image Tools" {...allyProps(0)} />
        <Tab label="Speech" {...allyProps(1)} />
        <Tab label="Storage" {...allyProps(2)} />
        <Tab label="Memo" {...allyProps(3)} />
        <Tab label="Others" {...allyProps(4)} />
      </StyledTabs>
      <TabPanel value={value} index={0}>
        <WatermarkContainer></WatermarkContainer>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <SpeechPanel></SpeechPanel>
      </TabPanel>
      <TabPanel value={value} index={2}>
        {" "}
        Storage{" "}
      </TabPanel>
      <TabPanel value={value} index={3}>
        {" "}
        Memo
      </TabPanel>
      <TabPanel value={value} index={4}>
        {" "}
        Others{" "}
      </TabPanel>
    </RootContainer>
  );
}
