import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { RC } from "./common";
import { ListView } from "./ListView";
import { SideMenu } from "./SideMenu";
import { TopBar } from "./TopBar";

const theme = createMuiTheme({
  typography: {
    fontFamily: "Roboto, Noto, sans-serif",
    fontSize: 14,
    subtitle1: {
      fontFamily: "Roboto, Arial, sans-serif",
      fontSize: 10,
    },
    h4: {
      fontFamily: "Roboto, Arial, sans-serif",
      fontSize: 14,
      fontWeight: 500,
    },
    body1: {
      fontFamily: "Roboto, Arial, sans-serif",
      fontSize: 16,
      fontWeight: 400,
    },
    body2: {
      fontFamily: "Roboto, Arial, sans-serif",
      fontSize: 14,
      fontWeight: 400,
    },
  },
  palette: {
    secondary: {
      main: "#FF0000",
    },
  },
});

export default function App(): RC {
  return (
    <CssBaseline>
      <ThemeProvider theme={theme}>
        <Router>
          <div style={{ backgroundColor: "white" }}>
            <TopBar />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "min-content auto",
              }}
            >
              <SideMenu />
              <ListView />
            </div>
          </div>
        </Router>
      </ThemeProvider>
    </CssBaseline>
  );
}
