
import * as React from "react";
import { Link } from "react-router-dom";
import { 
  Drawer, 
  Divider, 
  IconButton, 
  List, 
  ListItem, 
  ListItemIcon,
  ListItemText
} from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
import { ChevronLeft } from "@material-ui/icons";
import ImageIcon from '@material-ui/icons/Image';
import EventNoteIcon from '@material-ui/icons/EventNote';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import OtherHousesIcon from '@material-ui/icons/OtherHouses';

import { DRAWER_WIDTH } from "../../utils/constants";

const drawerWidth = DRAWER_WIDTH;

const DrawerHeader = styled('div')(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below appbar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

interface UtilitiesDrawerProps {
  utilityKeys: string[];
  utilityTitles: string[];
  onUtilityClick: (utilityKey: string) => void;
  onDrawerClose: () => void;
  open: boolean;
}

const UtilitiesDrawer: React.FC<UtilitiesDrawerProps> = (props: UtilitiesDrawerProps) => {

  function handleClose() {
    props.onDrawerClose();
  }
  const utilities = props.utilityKeys;
  const utilitiesIcons = [
    <ImageIcon/>, 
    <EventNoteIcon/>,
    <FileCopyIcon/>,
    <OtherHousesIcon/>
  ];

  return (
    <Drawer
    sx={{
      width: drawerWidth,
      flexShrink: 0,
      '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box'
      }
    }}
    variant="persistent"
    anchor="left"
    open={props.open}
    >
      <DrawerHeader>
        <IconButton onClick={handleClose}>
          <ChevronLeft />
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {utilities.map((utilKey, index) => (
          <ListItem button component={Link} to={utilKey} key={utilKey} onClick={() => (props.onUtilityClick(utilKey))}>
            <ListItemIcon>
              {utilitiesIcons[index%4]}
            </ListItemIcon>
            <ListItemText primary={props.utilityTitles[index]} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  )
};

export default UtilitiesDrawer;

