
import * as React from 'react';
import { 
  Box,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  ListSubheader,
  Collapse
} from "@material-ui/core";
import {
  ExpandLess,
  ExpandMore,
  StarBorder
} from "@material-ui/icons";
import DraftsIcon from "@material-ui/icons/Drafts"
import SendIcon from "@material-ui/icons/Send";
import { styled } from "@material-ui/core/styles";

const StyledCategoryPane = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: "360px",
  backgroundColor: theme.palette.background.paper,
  borderRight: "1px solid black"
}));

const MemoCategoryPane: React.FC = (props) => {

  const [notebookExpand, setNotebookExpand] = React.useState<boolean>(false);

  function handleNotebooksClicked() {
    setNotebookExpand(!notebookExpand);
  }

  return (
    <StyledCategoryPane>
      <List 
      sx={{width: "100%"}}
      subheader={
        <ListSubheader component="div">Categories</ListSubheader>
      }
      >
        <ListItemButton>
          <ListItemIcon>
            <DraftsIcon />
          </ListItemIcon>
          <ListItemText primary="Notes" />
        </ListItemButton>
        <ListItemButton onClick={handleNotebooksClicked}>
          <ListItemIcon>
            <SendIcon />
          </ListItemIcon>
          <ListItemText primary="Notebooks" />
          {notebookExpand ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={notebookExpand} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText primary="Starred" />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
    </StyledCategoryPane>
  );
};

export default MemoCategoryPane;
