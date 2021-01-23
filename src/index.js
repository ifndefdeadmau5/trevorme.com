import React, { useState } from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "styled-components";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { Switch } from "@material-ui/core";
import { StylesProvider } from "@material-ui/core/styles";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

const Root = () => {
  const [dark, setDark] = useState(true);

  const theme = createMuiTheme({
    palette: {
      type: dark ? "dark" : "light",
      primary: {
        main: "#006064",
      },
      secondary: {
        main: "#bbdefb",
      },
    },
  });

  return (
    <StylesProvider injectFirst>
      <MuiThemeProvider theme={theme}>
        <ThemeProvider theme={theme}>
          <App
            darkSwitch={
              <Switch
                checked={dark}
                onChange={(e, checked) => setDark(checked)}
              />
            }
          />
        </ThemeProvider>
      </MuiThemeProvider>
    </StylesProvider>
  );
};

ReactDOM.render(
  <Root />,

  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
