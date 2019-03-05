import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Header from './components/Header';
import OSS from './components/OSS';
import styled from 'styled-components';
import Footer from './components/Footer';
import ExperimentList from './components/ExperimentList';

const PAGE_HOME = 0;
const PAGE_OSS = 1;

const Main = styled.div({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  minHeight: '100vh',
});
const MarginContainer = styled.div({
  marginTop: 64,
  marginBottom: 64,
  marginLeft: 'auto',
  marginRight: 'auto',
});
const ContentWrapper = styled.div({
  width: 550,
})

export default () => {
  const [page, setPage] = useState(PAGE_OSS);
  return (
    <div>
      <Header onSelect={setPage} />
      <Main>
        <MarginContainer>
          {page === PAGE_HOME && (
            <ExperimentList items={'Lorem ipsum dolor sit'.split(' ')} />
          )}
          {page === PAGE_OSS && <OSS />}
        </MarginContainer>
        <Footer />
      </Main>
    </div>
  );
};
