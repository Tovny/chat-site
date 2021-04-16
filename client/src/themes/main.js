import { createMuiTheme } from "@material-ui/core/styles";

import { grey } from "@material-ui/core/colors";

const mainTheme = createMuiTheme({
  palette: {
    primary: {
      main: grey[900],
    },
    secondary: {
      main: grey[50],
    },
  },
});

export default mainTheme;
