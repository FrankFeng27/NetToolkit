  
import { createTheme } from '@material-ui/core/styles';

// A custom theme for this app
const theme = createTheme({
  palette: {}
});

function transformTheme(theme) {
    return theme;
}

const themeExport = transformTheme(theme);

export default themeExport;