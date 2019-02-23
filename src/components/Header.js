import React, { useState, useEffect } from 'react';
import Appbar from '@material-ui/core/Appbar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';

const Wrapper = styled.div(({ offsetY }) => ({
  maxWidth: 550,
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
}));
const StyledAppbar = styled(Appbar)(({ offsetY }) => ({
  backgroundColor: 'white',
  boxShadow: `0px 2px 4px -1px rgba(0,0,0,${Math.min(
    0.2,
    offsetY / 200,
  )}), 0px 4px 5px 0px rgba(0,0,0,${Math.min(
    0.14,
    offsetY / 200,
  )}), 0px 1px 10px 0px rgba(0,0,0,${Math.min(0.14, offsetY / 200)})`,
}));
const StyledToolbar = styled(Toolbar)({
  justifyContent: 'center',
});

export default () => {
  const [offsetY, setOffsetY] = useState(0);
  function listenScrollEvent() {
    if (Math.abs(offsetY - window.pageYOffset) > 30) {
      setOffsetY(window.pageYOffset);
    }
  }
  useEffect(() => {
    window.addEventListener('scroll', listenScrollEvent);
    return () => {
      window.addEventListener('scroll', listenScrollEvent);
    };
  });

  return (
    <StyledAppbar offsetY={offsetY}>
      <StyledToolbar>
        <Wrapper>
          <Button>Home</Button>
          <div>
            <Button>Blog</Button>
            <Button>OSS</Button>
          </div>
        </Wrapper>
      </StyledToolbar>
    </StyledAppbar>
  );
};
