import React, { Component } from 'react';
import Header from './components/Header';
import Container from './components/Container';
import styled, { ThemeProvider } from 'styled-components';

const MarginContainer = styled(Container)({
  marginTop: 64,
  maxWidth: 550,
  marginLeft: 'auto',
  marginRight: 'auto',
})

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <MarginContainer />
      </div>
    );
  }
}

export default App;
