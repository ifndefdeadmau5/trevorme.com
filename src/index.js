import React from 'react';
import ReactDOM from 'react-dom';
import JssProvider from 'react-jss/lib/JssProvider';
import { ThemeProvider } from 'styled-components';
import { create } from 'jss';
import {
  createMuiTheme,
  createGenerateClassName,
  jssPreset,
  MuiThemeProvider,
} from '@material-ui/core/styles';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const generateClassName = createGenerateClassName();
const jss = create({
  ...jssPreset(),
  // We define a custom insertion point that JSS will look for injecting the styles in the DOM.
  insertionPoint: document.getElementById('jss-insertion-point'),
});

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#E60012',
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      light: '#f9c457',
      main: '#f8b62d',
      // dark: will be calculated from palette.secondary.main,
      contrastText: '#ffcc00',
    },
    // error: will use the default color
  },
});

ReactDOM.render(
  <JssProvider jss={jss} generateClassName={generateClassName}>
    <MuiThemeProvider theme={theme}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </MuiThemeProvider>
  </JssProvider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
