import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Header from './components/Header';
import OSS from './components/OSS';
import styled from 'styled-components';

const PAGE_HOME = 0;
const PAGE_OSS = 1;

const MarginContainer = styled.div({
  marginTop: 64,
  maxWidth: 550,
  marginLeft: 'auto',
  marginRight: 'auto',
});

export default () => {
  const [page, setPage] = useState(PAGE_HOME);
  return (
    <div>
      <Header onSelect={setPage} />
      <MarginContainer>
        {page === PAGE_HOME && (
          <Typography>
            {Array.apply(null, Array(50))
              .map(
                () => `Cras mattis consectetur purus sit amet fermentum.
Cras justo odio, dapibus ac facilisis in, egestas eget quam.
Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`,
              )
              .join('\n')}
          </Typography>
        )}
        {page === PAGE_OSS && <OSS />}
      </MarginContainer>
    </div>
  );
};
